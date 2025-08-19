/// <reference types="vite/client" />
/// <reference types="vite/types/importMeta.d.ts"/>

interface ImportMetaEnv {
  readonly VITE_GOOGLE_AI_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
<<<<<<< HEAD
}

// Web Speech API declarations
interface SpeechRecognitionConstructor {
  new (): SpeechRecognition;
}

interface Window {
  SpeechRecognition: SpeechRecognitionConstructor;
  webkitSpeechRecognition: SpeechRecognitionConstructor;
}
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}
=======
}
>>>>>>> 1e061faa48b29d975b4f2c516a5b3184d56ae42e
