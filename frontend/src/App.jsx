import React, { useState, useEffect } from 'react';

const App = () => {
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [status, setStatus] = useState('Tap shield to authenticate');
    const [liveness, setLiveness] = useState(true);
    const [authResult, setAuthResult] = useState(null);

    const handleAuthenticate = async () => {
        if (isAuthenticating) return;

        setIsAuthenticating(true);
        setStatus('Verifying Liveness...');

        // Simulate liveness and biometric capture
        setTimeout(async () => {
            setStatus('Generating Bio Hash...');

            try {
                const response = await fetch('http://localhost:3001/api/auth/bio', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        biometricData: 'face_scan_data_77821',
                        userId: 'daniel_art_01',
                        livenessVerified: true
                    })
                });

                const data = await response.json();

                if (data.success) {
                    setStatus('Identity Secured');
                    setAuthResult(data.auth);
                    console.log('Secure Token:', data.auth.token);
                } else {
                    setStatus('Authentication Failed');
                }
            } catch (error) {
                setStatus('Server Connection Error');
            } finally {
                setIsAuthenticating(false);
            }
        }, 1500);
    };

    return (
        <div className="relative flex h-full min-h-screen w-full flex-col justify-between overflow-x-hidden p-6 bg-gradient-to-b from-[#2a3245] to-[#151925]">
            {/* Background Blobs */}
            <div className="absolute top-[-10%] left-[-20%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
            <div className="absolute bottom-[10%] right-[-10%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none z-0"></div>
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-15 mix-blend-overlay pointer-events-none z-0"></div>

            <header className="relative z-10 flex flex-col items-center pt-8">
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-dark-metal border border-accent-silver/30 mb-5 shadow-[0_0_20px_rgba(0,240,255,0.15)] relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-accent-silver/10 to-transparent opacity-50"></div>
                    <span className="material-symbols-outlined text-primary text-3xl drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]">local_hospital</span>
                </div>
                <h2 className="text-chrome tracking-tight text-[32px] font-bold leading-tight text-center drop-shadow-lg">BioNucle</h2>
                <p className="text-primary/80 text-xs font-semibold tracking-[0.25em] uppercase mt-1 drop-shadow-[0_0_5px_rgba(0,240,255,0.4)]">Medical Identity Module</p>
            </header>

            <main className="relative z-10 flex flex-col items-center justify-center flex-grow py-8 w-full">
                <div className="relative flex items-center justify-center">
                    <div className="absolute inset-0 -m-10 border border-dashed border-accent-silver/20 rounded-full animate-spin-slow w-84 h-84 opacity-40"></div>
                    <div className="absolute inset-0 -m-4 border border-primary/10 rounded-full w-72 h-72"></div>
                    <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping opacity-20 duration-1000"></div>

                    <button
                        onClick={handleAuthenticate}
                        disabled={isAuthenticating}
                        className={`relative group flex flex-col items-center justify-center w-64 h-64 rounded-full glass-shield transition-all duration-300 hover:scale-105 hover:shadow-[0_0_70px_rgba(0,240,255,0.25)] hover:border-primary/40 active:scale-95 cursor-pointer overflow-hidden ${isAuthenticating ? 'scale-95 opacity-80' : ''}`}
                    >
                        <div className="absolute inset-0 rounded-full border border-white/5 pointer-events-none"></div>
                        <div className={`absolute w-full h-[2px] bg-primary/80 top-1/2 left-0 shadow-[0_0_15px_#00f0ff] animate-[pulse_2s_infinite] transition-opacity duration-500 z-10 ${isAuthenticating ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}></div>
                        <div className="flex flex-col items-center justify-center gap-2 z-20">
                            <span className={`material-symbols-outlined text-7xl text-primary drop-shadow-[0_0_15px_rgba(0,240,255,0.7)] group-hover:text-white transition-colors duration-300 ${isAuthenticating ? 'animate-pulse' : ''}`}>
                                {authResult ? 'verified_user' : 'shield_lock'}
                            </span>
                            <div className="h-[3px] w-8 bg-primary/50 rounded-full mt-4 shadow-[0_0_10px_rgba(0,240,255,0.5)]"></div>
                        </div>
                        <div className="absolute top-0 left-0 w-full h-[45%] bg-gradient-to-b from-white/10 to-transparent rounded-t-full pointer-events-none"></div>
                    </button>
                </div>

                <div className="mt-14 flex flex-col items-center gap-3">
                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-background-dark/80 border border-primary/30 shadow-[0_0_15px_rgba(0,240,255,0.1)] backdrop-blur-md">
                        <span className="relative flex h-2 w-2">
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 ${liveness ? '' : 'bg-red-500'}`}></span>
                            <span className={`relative inline-flex rounded-full h-2 w-2 bg-primary shadow-[0_0_8px_#00f0ff] ${liveness ? '' : 'bg-red-500 shadow-[0_0_8px_#ff0000]'}`}></span>
                        </span>
                        <span className="text-primary text-[10px] font-bold tracking-wider uppercase drop-shadow-[0_0_5px_rgba(0,240,255,0.5)]">
                            {liveness ? 'Liveness Check Active' : 'Liveness Offline'}
                        </span>
                    </div>
                    <p className={`text-accent-silver/70 text-base font-normal leading-normal text-center ${isAuthenticating ? 'animate-pulse' : ''}`}>
                        {status}
                    </p>

                    {authResult && (
                        <div className="mt-4 px-4 py-2 rounded-lg glass-panel animate-in fade-in slide-in-from-bottom-2">
                            <p className="text-[10px] font-mono text-primary">AUDIT_ID: {authResult.auditId}</p>
                        </div>
                    )}
                </div>
            </main>

            <footer className="relative z-10 flex flex-col items-center gap-6 pb-6 w-full">
                <div className="w-full max-w-xs">
                    <button className="group relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-4 glass-panel hover:bg-red-900/20 hover:border-red-500/40 transition-all duration-300">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                        <span className="material-symbols-outlined text-accent-silver/60 group-hover:text-red-400 mr-2 text-lg transition-colors">e911_emergency</span>
                        <span className="text-accent-silver/80 text-sm font-bold tracking-wide group-hover:text-red-100 transition-colors uppercase">Emergency Override</span>
                    </button>
                </div>
                <div className="flex flex-col items-center gap-1 opacity-50 hover:opacity-100 transition-opacity">
                    <div className="h-[1px] w-12 bg-accent-silver/20 mb-2"></div>
                    <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[12px] text-primary">lock</span>
                        <span className="text-[10px] uppercase tracking-[0.15em] font-bold text-accent-silver">Secured by BioNucle Core</span>
                    </div>
                    <p className="text-[9px] text-accent-silver/40 font-mono">v4.2.0 • Build 8921</p>
                </div>
            </footer>
        </div>
    );
};

export default App;
