'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface FollowUser {
  id: string;
  username: string;
  avatar: string | null;
  bio: string | null;
  role: string;
  followedAt: string;
  isFollowing: boolean;
  isMe: boolean;
}

interface FollowersModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  username: string;
  initialTab: 'followers' | 'following';
}

export default function FollowersModal({
  isOpen,
  onClose,
  userId,
  username,
  initialTab
}: FollowersModalProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'followers' | 'following'>(initialTab);
  const [users, setUsers] = useState<FollowUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [followingStates, setFollowingStates] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (isOpen) {
      loadUsers();
    }
  }, [isOpen, activeTab, userId]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('takopi_token');
      const response = await fetch(
        `/api/follow/list?userId=${userId}&type=${activeTab}`,
        {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        }
      );

      if (response.ok) {
        const result = await response.json();
        setUsers(result.data.users);
        // Inicializar estados de follow
        const states: Record<string, boolean> = {};
        result.data.users.forEach((u: FollowUser) => {
          states[u.id] = u.isFollowing;
        });
        setFollowingStates(states);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFollow = async (targetUserId: string) => {
    const token = localStorage.getItem('takopi_token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    // Optimistic update
    setFollowingStates(prev => ({
      ...prev,
      [targetUserId]: !prev[targetUserId]
    }));

    try {
      const response = await fetch('/api/follow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ followingId: targetUserId })
      });

      if (!response.ok) {
        // Revertir si falla
        setFollowingStates(prev => ({
          ...prev,
          [targetUserId]: !prev[targetUserId]
        }));
      }
    } catch (error) {
      // Revertir si falla
      setFollowingStates(prev => ({
        ...prev,
        [targetUserId]: !prev[targetUserId]
      }));
    }
  };

  const handleViewProfile = (targetUserId: string) => {
    onClose();
    router.push(`/user/${targetUserId}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-[#0a0a0a] rounded-2xl border border-white/10 shadow-2xl max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">@{username}</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('followers')}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'followers'
                  ? 'bg-white text-black'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              Seguidores
            </button>
            <button
              onClick={() => setActiveTab('following')}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'following'
                  ? 'bg-white text-black'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              Siguiendo
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">
                {activeTab === 'followers' ? '👥' : '🔍'}
              </div>
              <p className="text-gray-400">
                {activeTab === 'followers'
                  ? 'Aún no tiene seguidores'
                  : 'Aún no sigue a nadie'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
                >
                  {/* Avatar */}
                  <div
                    onClick={() => handleViewProfile(user.id)}
                    className="w-12 h-12 rounded-full overflow-hidden bg-purple-500/20 flex-shrink-0 cursor-pointer"
                  >
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-purple-400 text-lg font-bold">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div
                      onClick={() => handleViewProfile(user.id)}
                      className="font-medium text-white hover:text-purple-400 cursor-pointer transition-colors truncate"
                    >
                      @{user.username}
                    </div>
                    {user.bio && (
                      <p className="text-xs text-gray-500 truncate">{user.bio}</p>
                    )}
                    <span className="text-xs text-gray-600">
                      {user.role === 'Artist' && '🎨 Artista'}
                      {user.role === 'Maker' && '🛠️ Maker'}
                      {user.role === 'Explorer' && '🔍 Explorer'}
                      {user.role === 'Admin' && '⚡ Admin'}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {!user.isMe && (
                      <button
                        onClick={() => handleToggleFollow(user.id)}
                        className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          followingStates[user.id]
                            ? 'bg-white/10 text-white hover:bg-red-500/20 hover:text-red-400'
                            : 'bg-purple-500 text-white hover:bg-purple-600'
                        }`}
                      >
                        {followingStates[user.id] ? 'Siguiendo' : 'Seguir'}
                      </button>
                    )}
                    {user.isMe && (
                      <span className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 text-gray-500">
                        Tú
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
