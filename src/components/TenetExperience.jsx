import { useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { ScrollControls, Scroll } from '@react-three/drei';
import ArchitecturalScene from './ArchitecturalScene';
import { neonAudio } from '../utils/neonAudio';

export default function TenetExperience() {
  const [activeTab, setActiveTab] = useState('home');
  const [activeProject, setActiveProject] = useState(null);
  const prevTabRef = useRef('home');

  return (
    <div className="w-full h-screen bg-[#050505] selection:bg-white selection:text-black font-sans relative overflow-hidden">

      {/* Absolute persistent overlay for the layout */}
      <div className="absolute inset-0 z-40 pointer-events-none p-6 sm:p-8 flex flex-col justify-between">

        <header className="flex justify-end w-full">
          <nav className="flex flex-wrap justify-center sm:flex-nowrap gap-3 sm:gap-6 md:gap-8 text-[9px] sm:text-[10px] md:text-xs tracking-[0.2em] font-medium uppercase text-white pointer-events-auto mix-blend-difference">
            <span 
              onClick={() => {
                setActiveTab('home');
                neonAudio.triggerOff();
              }} 
              className={`hover:opacity-100 cursor-pointer transition-all duration-300 ${activeTab === 'home' ? 'opacity-100 text-[#ff7043] font-bold' : 'opacity-60'}`}
            >
              HOME
            </span>
            <span 
              onClick={() => {
                setActiveTab('home');
                neonAudio.triggerOff();
              }} 
              className="hover:opacity-100 cursor-pointer transition-opacity opacity-60"
            >
              ESTUDIO
            </span>
            <span 
              onClick={() => {
                setActiveTab('proyectos');
                setActiveProject(null);
                neonAudio.triggerOff();
              }} 
              className={`hover:opacity-100 cursor-pointer transition-all duration-300 ${activeTab === 'proyectos' ? 'opacity-100 text-[#ff7043] font-bold' : 'opacity-60'}`}
            >
              PROYECTOS
            </span>
            <span 
              onClick={() => {
                setActiveTab('home');
                neonAudio.triggerOff();
              }} 
              className="hover:opacity-100 cursor-pointer transition-opacity opacity-60"
            >
              ESPECIALIDAD
            </span>
            <span 
              onClick={() => {
                setActiveTab('contacto');
                neonAudio.triggerOff();
              }} 
              className={`hover:opacity-100 cursor-pointer transition-all duration-300 ${activeTab === 'contacto' ? 'opacity-100 text-[#ff7043] font-bold' : 'opacity-60'}`}
            >
              CONTACTO
            </span>
          </nav>
        </header>

        <div className="flex-grow flex items-start justify-center pt-24 sm:pt-32 pointer-events-none">
          {/* Main title text removed at user's request */}
        </div>

        {/* Persistent Footer: Fade out when showing contacto for cleaner visual space */}
        <footer className={`flex justify-between items-end w-full pb-4 transition-all duration-700 ${activeTab === 'contacto' ? 'opacity-0 translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'}`}>
          <div className="text-white mix-blend-difference">
            <h2 className="text-sm sm:text-lg md:text-xl font-light uppercase tracking-widest leading-snug">
              UNA NUEVA DIMENSIÓN<br />DE VIDA MODERNA
            </h2>
          </div>
          <div className="text-white/60 mix-blend-difference font-mono text-[9px] sm:text-[10px] md:text-xs uppercase tracking-[0.2em]">
            MADRID, ESPAÑA
          </div>
        </footer>
      </div>

      {/* Editorial Contact Overlay Card */}
      <div 
        className={`absolute inset-y-0 left-0 z-50 w-full sm:w-[460px] bg-[#050505]/30 lg:bg-[#050505]/95 backdrop-blur-sm lg:backdrop-blur-md p-8 sm:p-12 md:p-16 flex flex-col justify-center text-white border-r border-white/5 transition-all duration-700 ease-out ${
          activeTab === 'contacto' 
            ? 'translate-x-0 opacity-100 pointer-events-auto' 
            : '-translate-x-full opacity-0 pointer-events-none'
        }`}
      >
        <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-[#ff7043] mb-3 sm:mb-4 block">CONTACTO</span>
        <h2 className="text-4xl sm:text-5xl font-bold uppercase tracking-tight mb-6 sm:mb-8 leading-none">Diseñemos<br />Tu Espacio</h2>
        
        <div className="space-y-6 sm:space-y-8 font-light text-white/80">
          <div>
            <h4 className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-white/40 mb-1 sm:mb-2">EMAIL</h4>
            <a href="mailto:studio@tenet.es" className="text-base sm:text-lg hover:text-[#ff7043] transition-colors font-medium">studio@tenet.es</a>
          </div>
          <div>
            <h4 className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-white/40 mb-1 sm:mb-2">TELÉFONO</h4>
            <a href="tel:+34910234567" className="text-base sm:text-lg hover:text-[#ff7043] transition-colors font-medium">+34 910 234 567</a>
          </div>
          <div>
            <h4 className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-white/40 mb-1 sm:mb-2">ESTUDIO</h4>
            <p className="text-sm sm:text-base leading-relaxed">
              Calle de Serrano, 45, Planta 4<br />
              28001 Madrid, España
            </p>
          </div>
        </div>

        <button 
          onClick={() => {
            setActiveTab('home');
            neonAudio.triggerOff();
          }} 
          className="mt-10 sm:mt-12 w-fit px-5 sm:px-6 py-3 border border-white/20 hover:border-[#ff7043] hover:text-[#ff7043] hover:bg-[#ff7043]/5 text-[10px] sm:text-xs uppercase tracking-widest font-medium transition-all duration-300 pointer-events-auto rounded-none cursor-pointer"
        >
          VOLVER AL INICIO
        </button>
      </div>

      {/* Full-Screen 2D Project Details Page */}
      <div 
        className={`absolute inset-0 z-50 w-full h-full bg-[#f0eee9] overflow-y-auto transition-opacity duration-1000 ease-out ${
          activeProject 
            ? 'opacity-100 pointer-events-auto' 
            : 'opacity-0 pointer-events-none'
        }`}
      >
        {activeProject && (
          <div className="min-h-full flex flex-col">
            {/* Header / Hero block with project color */}
            <div 
              className="w-full h-[40vh] sm:h-[50vh] flex flex-col justify-end p-8 sm:p-16 md:p-24 text-white relative"
              style={{ backgroundColor: activeProject.color }}
            >
              {/* Back button positioned at top left */}
              <button 
                onClick={() => setActiveProject(null)} 
                className="absolute top-8 left-8 sm:top-12 sm:left-12 px-5 py-3 border border-white/30 hover:bg-white hover:text-black text-xs uppercase tracking-widest font-medium transition-all duration-300 rounded-none cursor-pointer"
              >
                ← VOLVER A LA GALERÍA
              </button>
              
              <div className="max-w-4xl">
                <span className="font-mono text-xs sm:text-sm uppercase tracking-[0.2em] opacity-80 mb-4 block">{activeProject.category}</span>
                <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold uppercase tracking-tight leading-none">{activeProject.title}</h1>
              </div>
            </div>

            {/* Content Section */}
            <div className="w-full max-w-5xl mx-auto p-8 sm:p-16 md:p-24 flex flex-col md:flex-row gap-16 md:gap-24 text-[#111111]">
              <div className="flex-1 space-y-8">
                <h3 className="text-2xl font-medium tracking-tight">Sobre el Proyecto</h3>
                <p className="text-base sm:text-lg lg:text-xl font-light leading-relaxed text-[#333333]">
                  {activeProject.description}
                  <br /><br />
                  Este espacio está diseñado para albergar una descripción mucho más extensa del proyecto. Aquí se pueden detallar los materiales utilizados, el proceso creativo, los retos arquitectónicos superados y la visión del cliente. La transición 2D permite una lectura cómoda y sin distracciones espaciales.
                </p>
              </div>
              
              <div className="w-full md:w-64 space-y-12">
                <div>
                  <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-black/40 mb-3 border-b border-black/10 pb-2">CLIENTE</h4>
                  <p className="text-lg font-medium">{activeProject.client}</p>
                </div>
                <div>
                  <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-black/40 mb-3 border-b border-black/10 pb-2">AÑO</h4>
                  <p className="text-lg font-medium">{activeProject.year}</p>
                </div>
                <div>
                  <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-black/40 mb-3 border-b border-black/10 pb-2">UBICACIÓN</h4>
                  <p className="text-lg font-medium">Madrid, España</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Canvas shadows camera={{ position: [0, 1.5, 3], fov: 45 }} dpr={window.innerWidth < 768 ? [1, 1] : [1, 2]}>
        <ScrollControls pages={activeTab === 'contacto' ? 1 : activeTab === 'proyectos' ? 5 : 8} damping={0.2}>
          <ArchitecturalScene activeTab={activeTab} activeProject={activeProject} setActiveProject={setActiveProject} />
          
          {/* Home Scroll Texts */}
          <Scroll html style={{ width: '100%', height: '100%', pointerEvents: activeTab === 'home' ? 'auto' : 'none' }}>
            <div className={`w-full h-full transition-opacity duration-500 ${activeTab === 'home' ? 'opacity-100' : 'opacity-0'}`}>
              {/* The first 2 pages are room camera transitions, so we leave it empty here */}
              <div className="h-[200vh] w-full"></div>

              {/* The Entrance: Displays exactly while the camera is paused at the painting/shelf (Z: 2.0 to 3.5) */}
              <div className="h-[150vh] w-full flex items-center justify-start px-6 sm:px-12 md:px-32 text-white pointer-events-none">
                <div className="max-w-2xl mix-blend-difference">
                  <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-[#ff7043] mb-3 sm:mb-4 block">EL ACCESO</span>
                  <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold uppercase tracking-tight mb-4 sm:mb-8">Calidez<br />& Luz</h2>
                  <p className="text-base sm:text-lg md:text-xl font-light text-white/80 leading-relaxed">
                    Cada paso en el interior está diseñado para acercarte al núcleo de la experiencia, envolviéndote en un confort absoluto.
                  </p>
                </div>
              </div>

              {/* The Corridor: Displays as the camera rotates and transitions into the corridor (Z: 3.5 to 5.0) */}
              <div className="h-[150vh] w-full flex items-center justify-end px-6 sm:px-12 md:px-32 text-white pointer-events-none text-right">
                <div className="max-w-2xl mix-blend-difference">
                  <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-[#ff7043] mb-3 sm:mb-4 block">EL PASILLO</span>
                  <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold uppercase tracking-tight mb-4 sm:mb-8">Guiados<br />Por El Diseño</h2>
                  <p className="text-base sm:text-lg md:text-xl font-light text-white/80 leading-relaxed">
                    Ricos paneles de madera y superficies pulidas trazan un recorrido táctil, conectando los espacios de forma fluida y sin fisuras.
                  </p>
                </div>
              </div>

              {/* Corridor glide spacer (Z: 5.0 to 7.0) */}
              <div className="h-[200vh] w-full"></div>
            </div>
          </Scroll>

        </ScrollControls>
      </Canvas>
    </div>
  );
}
