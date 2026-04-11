export interface AudioRecord {
  id: string;
  uri: string;
  date: string;
}

export interface AudioItemProps {
  audio: AudioRecord;
  isPlaying: boolean;
  isDisabled: boolean;
  onPlay: (uri: string) => void;
  onDelete: (id: string) => void;
}

export interface RecordButtonProps {
  isRecording: boolean;
  onPress: () => void;
}

export interface NoPermissionScreenProps {
  canAskAgain: boolean;
  onRetry: () => void;
}