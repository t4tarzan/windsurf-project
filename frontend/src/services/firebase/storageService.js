import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { storage, db } from '../../config/firebase';

class StorageService {
  async uploadImage(file) {
    try {
      // First compress the image
      const compressedFile = await this.compressImage(file);
      
      // Create a unique filename with timestamp and random string
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const filename = `plant_images/${timestamp}_${randomString}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      
      const storageRef = ref(storage, filename);

      // Upload the file
      const snapshot = await uploadBytes(storageRef, compressedFile);
      const downloadURL = await getDownloadURL(snapshot.ref);

      console.log('Image uploaded successfully:', downloadURL);
      
      return {
        url: downloadURL,
        path: filename,
        size: compressedFile.size,
        type: compressedFile.type,
        timestamp
      };
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error(`Failed to upload image: ${error.message}`);
    }
  }

  async saveAnalysisResult(imageInfo, analysisResult) {
    try {
      const resultsRef = collection(db, 'plantAnalysis');
      
      const docData = {
        imageUrl: imageInfo.url,
        imagePath: imageInfo.path,
        imageSize: imageInfo.size,
        imageType: imageInfo.type,
        uploadTimestamp: imageInfo.timestamp,
        analysisTimestamp: serverTimestamp(),
        results: analysisResult,
        status: 'completed'
      };

      const docRef = await addDoc(resultsRef, docData);
      console.log('Analysis results saved with ID:', docRef.id);
      
      return {
        id: docRef.id,
        ...docData
      };
    } catch (error) {
      console.error('Error saving analysis result:', error);
      throw new Error(`Failed to save analysis result: ${error.message}`);
    }
  }

  async getExistingAnalysis(imageUrl) {
    try {
      const resultsRef = collection(db, 'plantAnalysis');
      const q = query(
        resultsRef,
        where('imageUrl', '==', imageUrl),
        where('status', '==', 'completed')
      );
      
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        console.log('Found existing analysis:', doc.id);
        return {
          id: doc.id,
          ...doc.data()
        };
      }

      console.log('No existing analysis found for URL:', imageUrl);
      return null;
    } catch (error) {
      console.error('Error getting existing analysis:', error);
      throw new Error(`Failed to get existing analysis: ${error.message}`);
    }
  }

  async compressImage(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = event => {
        const img = new Image();
        
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 800;
            const MAX_HEIGHT = 800;
            let width = img.width;
            let height = img.height;

            // Calculate new dimensions while maintaining aspect ratio
            if (width > height) {
              if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
              }
            } else {
              if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
              }
            }

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
              throw new Error('Failed to get canvas context');
            }

            // Fill with white background
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, width, height);
            
            // Draw the image
            ctx.drawImage(img, 0, 0, width, height);

            // Convert to blob
            canvas.toBlob(
              blob => {
                if (!blob) {
                  reject(new Error('Failed to create image blob'));
                  return;
                }

                const compressedFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                });

                console.log('Image compressed:', {
                  originalSize: file.size,
                  compressedSize: compressedFile.size,
                  width,
                  height
                });

                resolve(compressedFile);
              },
              'image/jpeg',
              0.8 // 80% quality
            );
          } catch (error) {
            console.error('Error in image compression:', error);
            reject(error);
          }
        };
        
        img.onerror = error => {
          console.error('Error loading image:', error);
          reject(new Error('Failed to load image for compression'));
        };

        img.src = event.target.result;
      };
      
      reader.onerror = error => {
        console.error('Error reading file:', error);
        reject(new Error('Failed to read image file'));
      };

      reader.readAsDataURL(file);
    });
  }
}

export default new StorageService();
