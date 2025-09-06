import React, { useState, useEffect } from 'react';
import { RotateCcw, Smartphone } from 'lucide-react';

const MobileOrientationHelper: React.FC = () => {
  const [showHelper, setShowHelper] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      const portrait = window.innerHeight > window.innerWidth;
      
      // Mostrar helper apenas em mobile e quando em portrait
      const isMobile = window.innerWidth < 768;
      setShowHelper(isMobile && portrait);
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  if (!showHelper) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-sm mx-auto text-center shadow-xl">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <Smartphone className="h-16 w-16 text-blue-600" />
            <RotateCcw className="h-6 w-6 text-orange-500 absolute -top-1 -right-1 animate-spin" />
          </div>
        </div>
        
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          Melhor Experiência em Landscape
        </h3>
        
        <p className="text-sm text-gray-600 mb-4">
          Para uma melhor visualização do modelo 3D e da planilha, 
          gire seu dispositivo para o modo paisagem (horizontal).
        </p>
        
        <div className="flex flex-col space-y-2 text-xs text-gray-500">
          <p>📱 <strong>Portrait:</strong> Ideal para navegação</p>
          <p>🖥️ <strong>Landscape:</strong> Ideal para visualização 3D</p>
        </div>
        
        <button
          onClick={() => setShowHelper(false)}
          className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          Entendi
        </button>
      </div>
    </div>
  );
};

export default MobileOrientationHelper;
