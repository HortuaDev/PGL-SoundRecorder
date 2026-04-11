import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'recorded_audios';

export interface AudioRecord {
  id: string;
  uri: string;
  date: string;
}

const storageService = {

  getAudios: async (): Promise<AudioRecord[]> => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting audios:', error);
      return [];
    }
  },

  saveAudio: async (uri: string): Promise<AudioRecord[]> => {
    try {
      const audios = await storageService.getAudios();
      const newAudio: AudioRecord = {
        id: Date.now().toString(),
        uri,
        date: new Date().toLocaleString('es-ES'),
      };
      const updated = [...audios, newAudio];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    } catch (error) {
      console.error('Error saving audio:', error);
      return [];
    }
  },

  deleteAudio: async (id: string): Promise<AudioRecord[]> => {
    try {
      const audios = await storageService.getAudios();
      const updated = audios.filter((a) => a.id !== id);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    } catch (error) {
      console.error('Error deleting audio:', error);
      return [];
    }
  },

  clearAudios: async (): Promise<AudioRecord[]> => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      return [];
    } catch (error) {
      console.error('Error clearing audios:', error);
      return [];
    }
  },

};

export default storageService;