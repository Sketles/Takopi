declare namespace JSX {
  interface IntrinsicElements {
    'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      src?: string;
      alt?: string;
      'auto-rotate'?: boolean;
      'camera-controls'?: boolean;
      'shadow-intensity'?: number;
      'exposure'?: number;
      'environment-image'?: string;
      poster?: string;
      loading?: 'auto' | 'lazy' | 'eager';
      reveal?: 'auto' | 'interaction' | 'manual';
      'ar-modes'?: string;
      ar?: boolean;
      'camera-orbit'?: string;
      'min-camera-orbit'?: string;
      'max-camera-orbit'?: string;
      'camera-target'?: string;
      'field-of-view'?: string;
      style?: React.CSSProperties;
      className?: string;
    };
  }
}

export {};

