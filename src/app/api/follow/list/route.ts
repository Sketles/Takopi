import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { config } from '@/config/env';

// GET - Obtener lista de seguidores o seguidos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const type = searchParams.get('type'); // 'followers' | 'following'

    if (!userId || !type) {
      return NextResponse.json(
        { error: 'userId y type son requeridos' },
        { status: 400 }
      );
    }

    if (type !== 'followers' && type !== 'following') {
      return NextResponse.json(
        { error: 'type debe ser "followers" o "following"' },
        { status: 400 }
      );
    }

    // Obtener token para saber si el usuario actual sigue a cada persona
    let currentUserId: string | null = null;
    const authHeader = request.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
      try {
        const token = authHeader.substring(7);
        const decoded = jwt.verify(token, config.jwt.secret) as any;
        currentUserId = decoded.userId;
      } catch {
        // Token inválido, continuar sin currentUserId
      }
    }

    let users: any[] = [];

    if (type === 'followers') {
      // Personas que siguen a userId
      const follows = await prisma.follow.findMany({
        where: { followingId: userId },
        include: {
          follower: {
            select: {
              id: true,
              username: true,
              avatar: true,
              bio: true,
              role: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      users = follows.map(f => ({
        id: f.follower.id,
        username: f.follower.username,
        avatar: f.follower.avatar,
        bio: f.follower.bio,
        role: f.follower.role,
        followedAt: f.createdAt
      }));
    } else {
      // Personas a las que userId sigue
      const follows = await prisma.follow.findMany({
        where: { followerId: userId },
        include: {
          following: {
            select: {
              id: true,
              username: true,
              avatar: true,
              bio: true,
              role: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      users = follows.map(f => ({
        id: f.following.id,
        username: f.following.username,
        avatar: f.following.avatar,
        bio: f.following.bio,
        role: f.following.role,
        followedAt: f.createdAt
      }));
    }

    // Si hay usuario logueado, verificar a quién sigue
    if (currentUserId && users.length > 0) {
      const userIds = users.map(u => u.id);
      const myFollows = await prisma.follow.findMany({
        where: {
          followerId: currentUserId,
          followingId: { in: userIds }
        },
        select: { followingId: true }
      });
      const followingSet = new Set(myFollows.map(f => f.followingId));
      
      users = users.map(u => ({
        ...u,
        isFollowing: followingSet.has(u.id),
        isMe: u.id === currentUserId
      }));
    } else {
      users = users.map(u => ({
        ...u,
        isFollowing: false,
        isMe: false
      }));
    }

    return NextResponse.json({
      success: true,
      data: {
        users,
        total: users.length,
        type
      }
    });

  } catch (error) {
    console.error('❌ Error fetching follow list:', error);
    return NextResponse.json(
      { error: 'Error al obtener lista' },
      { status: 500 }
    );
  }
}
