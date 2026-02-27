import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import '../styles/PlanPersonalizado.css';
import type { Producto, PlanOption } from '../types/planTypes';

const productosData: Producto[] = [
    { id: 'prod1', nombre: 'Producto adicional 1', precio: 150 },
    { id: 'prod2', nombre: 'Producto adicional 2', precio: 300 },
    { id: 'prod3', nombre: 'Producto adicional 3', precio: 450 },
    { id: 'prod4', nombre: 'Producto adicional 4', precio: 200 },
    { id: 'prod5', nombre: 'Producto adicional 5', precio: 350 },
    { id: 'prod6', nombre: 'Producto adicional 6', precio: 500 },
];

const planesData: PlanOption[] = [
    { value: 'basico', price: 80, name: 'Plan Básico', label: 'Plan Básico - $80' },
    { value: 'profesional', price: 120, name: 'Plan Profesional', label: 'Plan Profesional - $120' },
    { value: 'estudio', price: 3000, name: 'Plan Estudio', label: 'Plan Estudio - $3,000' },
];

export default function PlanPersonalizado() {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [empresa, setEmpresa] = useState('');
    const [planSeleccionado, setPlanSeleccionado] = useState('');
    const [productosSeleccionados, setProductosSeleccionados] = useState<string[]>([]);
    const [mensajeVisible, setMensajeVisible] = useState<'copiado' | 'contacto' | null>(null);
    const navigate = useNavigate();

    const planActual = planesData.find(p => p.value === planSeleccionado);
    const subtotalPlan = planActual?.price || 0;
    const subtotalProductos = productosSeleccionados.reduce((total, prodId) => {
        const prod = productosData.find(p => p.id === prodId);
        return total + (prod?.precio || 0);
    }, 0);
    const total = subtotalPlan + subtotalProductos;

    const toggleProducto = (id: string) => {
        setProductosSeleccionados(prev => 
            prev.includes(id) 
                ? prev.filter(p => p !== id)
                : [...prev, id]
        );
    };

    const mostrarMensaje = (tipo: 'copiado' | 'contacto') => {
        setMensajeVisible(tipo);
        setTimeout(() => setMensajeVisible(null), 4000);
    };

    const copiarAlPortapapeles = async () => {
        if (!planActual) {
            const select = document.querySelector('.form-select') as HTMLElement;
            select?.classList.add('error-shake');
            setTimeout(() => select?.classList.remove('error-shake'), 500);
            return;
        }

        const productosTexto = productosSeleccionados.length > 0 
            ? productosSeleccionados.map(id => {
                const prod = productosData.find(p => p.id === id);
                return `• ${prod?.nombre}: $${prod?.precio.toLocaleString()}`;
            }).join('\n')
            : '• Ninguno';

        const texto = `═══════════════════════════════════════
    COTIZACIÓN DE PLAN PERSONALIZADO
═══════════════════════════════════════

📋 DATOS DEL CLIENTE:
Nombre: ${nombre || 'No especificado'}
Email: ${email || 'No especificado'}
Empresa: ${empresa || 'No especificado'}

📦 PLAN SELECCIONADO:
${planActual.name} - $${planActual.price.toLocaleString()}

➕ PRODUCTOS ADICIONALES:
${productosTexto}

💰 TOTAL ESTIMADO: $${total.toLocaleString()}

═══════════════════════════════════════
Generado el: ${new Date().toLocaleString('es-ES')}
`;

        try {
            await navigator.clipboard.writeText(texto);
            mostrarMensaje('copiado');
            setTimeout(() => mostrarMensaje('contacto'), 2000);
        } catch {
            const textarea = document.createElement('textarea');
            textarea.value = texto;
            textarea.style.cssText = 'position:fixed;opacity:0;';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            mostrarMensaje('copiado');
            setTimeout(() => mostrarMensaje('contacto'), 2000);
        }
    };

    return (
        <div className="plan-page">
            <button 
              onClick={() => navigate('/')} 
              className="home-btn" 
              title="Volver al inicio"
              type="button"
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                  </svg>
                </button>

            <div className="plan-card">
                <h1 className="plan-title">Crea tu propio plan</h1>
                
                <div className="contact-fields">
                    <div className="form-group">
                        <label className="form-label">Nombre</label>
                        <input 
                            type="text" 
                            className="form-input"
                            placeholder="Tu nombre"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                        />
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input 
                            type="email" 
                            className="form-input"
                            placeholder="tu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">Empresa</label>
                        <input 
                            type="text" 
                            className="form-input"
                            placeholder="Nombre empresa (opcional)"
                            value={empresa}
                            onChange={(e) => setEmpresa(e.target.value)}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Selecciona tu plan</label>
                    <select 
                        className="form-select"
                        value={planSeleccionado}
                        onChange={(e) => setPlanSeleccionado(e.target.value)}
                    >
                        <option value="">-- Elige un plan --</option>
                        {planesData.map(plan => (
                            <option key={plan.value} value={plan.value}>
                                {plan.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="products-section">
                    <h3 className="products-title">Productos adicionales</h3>
                    <div className="products-grid">
                        {productosData.map(prod => (
                            <div 
                                key={prod.id}
                                className={`product-item ${productosSeleccionados.includes(prod.id) ? 'selected' : ''}`}
                                onClick={() => toggleProducto(prod.id)}
                            >
                                <div className="product-info">
                                    <div className="custom-checkbox">
                                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="11" height="11">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                    </div>
                                    <span className="product-name">{prod.nombre}</span>
                                </div>
                                <span className="product-price">${prod.precio.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="summary">
                    <div className="summary-row">
                        <span>Plan seleccionado:</span>
                        <span>{planActual?.name || 'Ninguno'}</span>
                    </div>
                    <div className="summary-row">
                        <span>Subtotal plan:</span>
                        <span>${subtotalPlan.toLocaleString()}</span>
                    </div>
                    <div className="summary-row">
                        <span>Adicionales:</span>
                        <span>${subtotalProductos.toLocaleString()}</span>
                    </div>
                    <div className="summary-row total">
                        <span>Total estimado</span>
                        <span className="summary-price">${total.toLocaleString()}</span>
                    </div>
                </div>

                <button 
                    type="button" 
                    className="btn-cotizar"
                    onClick={copiarAlPortapapeles}
                >
                    <span>Copiar detalles del plan</span>
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                              d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
                    </svg>
                </button>
            </div>

            <div className={`message ${mensajeVisible === 'copiado' ? 'show' : ''}`}>
                <div className="message-title">Portapapeles</div>
                <div className="message-text">Los detalles de tu plan se han copiado al portapapeles</div>
            </div>

            <div className={`message ${mensajeVisible === 'contacto' ? 'show' : ''}`}>
                <div className="message-title">¡Plan copiado!</div>
                <div className="message-text">Contáctanos en la página de inicio con los detalles de tu plan</div>
            </div>
        </div>
    );
}