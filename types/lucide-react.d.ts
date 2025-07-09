// Explicit type declarations for lucide-react
// This file ensures compatibility across all IDEs and environments

declare module 'lucide-react' {
  import * as React from 'react';

  export interface LucideProps extends Omit<React.SVGProps<SVGSVGElement>, 'ref'> {
    color?: string;
    size?: string | number;
    strokeWidth?: string | number;
    absoluteStrokeWidth?: boolean;
  }

  export type Icon = React.ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
  >;

  // Icons currently used in components
  export declare const AlertTriangle: Icon;
  export declare const RefreshCw: Icon;
  export declare const Home: Icon;
  export declare const Bug: Icon;
  export declare const ChevronDown: Icon;
  export declare const ChevronUp: Icon;
  export declare const CheckCircle: Icon;
  export declare const XCircle: Icon;
  export declare const AlertCircle: Icon;
  export declare const Info: Icon;
  export declare const X: Icon;
  export declare const Eye: Icon;
  export declare const EyeOff: Icon;
  export declare const Loader2: Icon;

  // Additional common icons
  export declare const User: Icon;
  export declare const Users: Icon;
  export declare const Mail: Icon;
  export declare const Lock: Icon;
  export declare const Unlock: Icon;
  export declare const Calendar: Icon;
  export declare const Clock: Icon;
  export declare const MapPin: Icon;
  export declare const Phone: Icon;
  export declare const Search: Icon;
  export declare const Filter: Icon;
  export declare const Plus: Icon;
  export declare const Minus: Icon;
  export declare const Edit: Icon;
  export declare const Trash: Icon;
  export declare const Trash2: Icon;
  export declare const Settings: Icon;
  export declare const LogOut: Icon;
  export declare const LogIn: Icon;
  export declare const Bell: Icon;
  export declare const Star: Icon;
  export declare const Heart: Icon;
  export declare const Share: Icon;
  export declare const Download: Icon;
  export declare const Upload: Icon;
  export declare const Save: Icon;
  export declare const Copy: Icon;
  export declare const Check: Icon;
  export declare const ArrowLeft: Icon;
  export declare const ArrowRight: Icon;
  export declare const ArrowUp: Icon;
  export declare const ArrowDown: Icon;
  export declare const ChevronLeft: Icon;
  export declare const ChevronRight: Icon;
  export declare const ExternalLink: Icon;
  export declare const Link: Icon;
  export declare const Menu: Icon;
  export declare const MoreHorizontal: Icon;
  export declare const MoreVertical: Icon;
  export declare const Play: Icon;
  export declare const Pause: Icon;
  export declare const Stop: Icon;
  export declare const Volume2: Icon;
  export declare const VolumeX: Icon;
  export declare const Camera: Icon;
  export declare const Image: Icon;
  export declare const File: Icon;
  export declare const FileText: Icon;
  export declare const Folder: Icon;
  export declare const FolderOpen: Icon;
  export declare const Code: Icon;
  export declare const Terminal: Icon;
  export declare const Zap: Icon;
  export declare const Award: Icon;
  export declare const Trophy: Icon;
  export declare const Target: Icon;
  export declare const Gamepad2: Icon;
  export declare const Bot: Icon;
  export declare const Cpu: Icon;
  export declare const HardDrive: Icon;
  export declare const Wifi: Icon;
  export declare const WifiOff: Icon;
  export declare const Bluetooth: Icon;
  export declare const Battery: Icon;
  export declare const Power: Icon;
  export declare const RotateCcw: Icon;
  export declare const RotateCw: Icon;
  export declare const Maximize: Icon;
  export declare const Minimize: Icon;
  export declare const Send: Icon;
  export declare const MessageSquare: Icon;
  export declare const MessageCircle: Icon;
  export declare const ThumbsUp: Icon;
  export declare const ThumbsDown: Icon;
  export declare const Flag: Icon;
  export declare const Bookmark: Icon;
  export declare const Tag: Icon;
  export declare const Layers: Icon;
  export declare const Grid3X3: Icon;
  export declare const List: Icon;
  export declare const Layout: Icon;
  export declare const Sidebar: Icon;
  export declare const PanelLeft: Icon;
  export declare const PanelRight: Icon;
}