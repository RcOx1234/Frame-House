import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { X, Check, ArrowRight } from 'lucide-react';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToContact: () => void;
}

interface Service {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  options: {
    id: string;
    name: string;
    price: number;
  }[];
}

const services: Service[] = [
  {
    id: 'social',
    name: 'Contenido Social',
    description: 'Videos short-form para redes sociales',
    basePrice: 0,
    options: [
      { id: 'social-4', name: '4 videos/mes', price: 299 },
      { id: 'social-8', name: '8 videos/mes', price: 499 },
      { id: 'social-12', name: '12 videos/mes', price: 699 },
    ]
  },
  {
    id: 'brand',
    name: 'Brand Films',
    description: 'Videos cinematográficos de marca',
    basePrice: 0,
    options: [
      { id: 'brand-1', name: '1 video corto (30-60s)', price: 399 },
      { id: 'brand-2', name: '1 video largo (1-3min)', price: 699 },
      { id: 'brand-pack', name: 'Pack completo (3 videos)', price: 1499 },
    ]
  },
  {
    id: 'ads',
    name: 'Creative Ads',
    description: 'Anuncios optimizados para conversión',
    basePrice: 0,
    options: [
      { id: 'ads-3', name: '3 variaciones', price: 199 },
      { id: 'ads-6', name: '6 variaciones', price: 349 },
      { id: 'ads-10', name: '10 variaciones + testing', price: 549 },
    ]
  },
  {
    id: 'editing',
    name: 'Edición',
    description: 'Edición profesional de video',
    basePrice: 0,
    options: [
      { id: 'edit-basic', name: 'Edición básica', price: 99 },
      { id: 'edit-pro', name: 'Edición pro + color', price: 199 },
      { id: 'edit-premium', name: 'Edición premium + motion', price: 349 },
    ]
  }
];

export default function QuoteModal({ isOpen, onClose, onGoToContact }: QuoteModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [selectedServices, setSelectedServices] = useState<Record<string, string[]>>({});
  const [currentStep, setCurrentStep] = useState<'services' | 'summary'>('services');

  useEffect(() => {
    const overlay = overlayRef.current;
    const content = contentRef.current;

    if (!overlay || !content) return;

    if (isOpen) {
      gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.3 });
      gsap.fromTo(content, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, delay: 0.1 });
    } else {
      gsap.to(content, { y: 30, opacity: 0, duration: 0.2 });
      gsap.to(overlay, { opacity: 0, duration: 0.3, delay: 0.1 });
    }
  }, [isOpen]);

  const toggleOption = (serviceId: string, optionId: string) => {
    setSelectedServices(prev => {
      const current = prev[serviceId] || [];
      if (current.includes(optionId)) {
        return { ...prev, [serviceId]: current.filter(id => id !== optionId) };
      }
      return { ...prev, [serviceId]: [...current, optionId] };
    });
  };

  const calculateTotal = () => {
    let total = 0;
    Object.entries(selectedServices).forEach(([serviceId, optionIds]) => {
      const service = services.find(s => s.id === serviceId);
      if (service) {
        optionIds.forEach(optionId => {
          const option = service.options.find(o => o.id === optionId);
          if (option) total += option.price;
        });
      }
    });
    return total;
  };

  const getSelectedItems = () => {
    const items: { service: string; option: string; price: number }[] = [];
    Object.entries(selectedServices).forEach(([serviceId, optionIds]) => {
      const service = services.find(s => s.id === serviceId);
      if (service) {
        optionIds.forEach(optionId => {
          const option = service.options.find(o => o.id === optionId);
          if (option) {
            items.push({ service: service.name, option: option.name, price: option.price });
          }
        });
      }
    });
    return items;
  };

  const handleGoToContact = () => {
    onClose();
    setTimeout(onGoToContact, 300);
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={overlayRef}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4 opacity-0"
      onClick={onClose}
    >
      <div 
        ref={contentRef}
        className="bg-[#0B0D10] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden opacity-0"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="font-heading font-bold text-2xl text-off-white">
            {currentStep === 'services' ? 'Arma tu paquete' : 'Resumen de cotización'}
          </h2>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-burnt-orange/20 transition-colors"
          >
            <X className="w-5 h-5 text-off-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {currentStep === 'services' ? (
            <div className="space-y-6">
              {services.map(service => (
                <div key={service.id} className="bg-white/5 rounded-xl p-4">
                  <h3 className="font-heading font-bold text-lg text-off-white mb-1">
                    {service.name}
                  </h3>
                  <p className="text-muted-warm text-sm mb-3">{service.description}</p>
                  
                  <div className="space-y-2">
                    {service.options.map(option => {
                      const isSelected = selectedServices[service.id]?.includes(option.id);
                      return (
                        <button
                          key={option.id}
                          onClick={() => toggleOption(service.id, option.id)}
                          className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                            isSelected 
                              ? 'bg-burnt-orange/20 border-burnt-orange/50' 
                              : 'bg-white/5 border-white/10 hover:bg-white/10'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                              isSelected ? 'bg-burnt-orange border-burnt-orange' : 'border-white/30'
                            }`}>
                              {isSelected && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <span className="text-off-white text-sm">{option.name}</span>
                          </div>
                          <span className="text-burnt-orange font-mono">${option.price}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {getSelectedItems().map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div>
                    <p className="text-off-white font-medium">{item.service}</p>
                    <p className="text-muted-warm text-sm">{item.option}</p>
                  </div>
                  <span className="text-burnt-orange font-mono">${item.price}</span>
                </div>
              ))}
              
              <div className="border-t border-white/10 pt-4 mt-4">
                <div className="flex items-center justify-between">
                  <span className="text-off-white font-heading font-bold text-xl">Total</span>
                  <span className="text-burnt-orange font-heading font-bold text-2xl">${calculateTotal()}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 bg-white/5">
          {currentStep === 'services' ? (
            <div className="flex items-center justify-between">
              <div>
                <span className="text-muted-warm text-sm">Total estimado:</span>
                <span className="text-burnt-orange font-heading font-bold text-xl ml-2">${calculateTotal()}</span>
              </div>
              <button 
                onClick={() => setCurrentStep('summary')}
                disabled={calculateTotal() === 0}
                className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Ver resumen
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-4">
              <button 
                onClick={() => setCurrentStep('services')}
                className="px-6 py-3 border border-white/20 rounded-xl text-off-white hover:bg-white/5 transition-colors"
              >
                Volver
              </button>
              <button 
                onClick={handleGoToContact}
                className="btn-primary flex items-center gap-2"
              >
                Continuar a contacto
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
