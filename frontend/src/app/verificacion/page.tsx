// app/verify-email/page.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useRef, Suspense } from 'react';
import { gsap } from 'gsap';

function VerifyEmailContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || '';

    const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
    const [formError, setFormError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [timeLeft, setTimeLeft] = useState(1); // 15 minutos
    const [canResend, setCanResend] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const floatingRef1 = useRef<HTMLDivElement>(null);
    const floatingRef2 = useRef<HTMLDivElement>(null);
    const floatingRef3 = useRef<HTMLDivElement>(null);

    // Validar que el email esté presente
    useEffect(() => {
        if (!email) {
            router.push('/login');
        }
    }, [email, router]);

    // Temporizador
    useEffect(() => {
        if (timeLeft <= 0) {
            setCanResend(true);
            return;
        }

        const timer = setTimeout(() => {
            setTimeLeft(timeLeft - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [timeLeft]);

    // Animaciones iniciales
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(containerRef.current, {
                opacity: 0,
                duration: 0.5
            });

            gsap.from(formRef.current, {
                y: 50,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out',
                delay: 0.2
            });

            gsap.from(titleRef.current, {
                y: -30,
                opacity: 0,
                duration: 0.6,
                ease: 'back.out(1.7)',
                delay: 0.4
            });

            gsap.to(floatingRef1.current, {
                y: -20,
                duration: 3,
                repeat: -1,
                yoyo: true,
                ease: 'power1.inOut'
            });

            gsap.to(floatingRef2.current, {
                y: -30,
                duration: 4,
                repeat: -1,
                yoyo: true,
                ease: 'power1.inOut',
                delay: 0.5
            });

            gsap.to(floatingRef3.current, {
                y: -25,
                duration: 3.5,
                repeat: -1,
                yoyo: true,
                ease: 'power1.inOut',
                delay: 1
            });
        });

        return () => ctx.revert();
    }, []);

    const handleCodeChange = (index: number, value: string) => {
        if (value.length > 1) return;
        if (!/^\d*$/.test(value)) return;

        const newCode = [...verificationCode];
        newCode[index] = value;
        setVerificationCode(newCode);

        // Auto-focus siguiente input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');

        const codigo = verificationCode.join('');
        if (codigo.length !== 6) {
            setFormError('Por favor ingresa los 6 dígitos');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch('http://localhost:5000/api/auth/verify-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    codigo
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Código inválido');
            }

            // Animación de éxito
            gsap.to(formRef.current, {
                scale: 1.05,
                duration: 0.2,
                yoyo: true,
                repeat: 1
            });

            // Guardar token si viene en la respuesta
            if (data.data?.token) {
                localStorage.setItem('token', data.data.token);
            }

            // Redirigir al login o dashboard
            setTimeout(() => {
                router.push(data.data?.token ? '/dashboard' : '/login?verified=true');
            }, 500);

        } catch (err: unknown) {
            if (err instanceof Error) {
                setFormError(err.message || 'Error al verificar el código');

            } else {
                setFormError(String(err) || 'Error al verificar el código');

            }

            // Animación de error
            gsap.fromTo(formRef.current,
                { x: -10 },
                {
                    x: 10,
                    duration: 0.1,
                    repeat: 3,
                    yoyo: true,
                    ease: 'power1.inOut',
                    onComplete: () => {
                        gsap.set(formRef.current, { x: 0 });
                    }
                }
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResendCode = async () => {
        setFormError('');
        try {
            const response = await fetch('http://localhost:5000/api/auth/resend-verification', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al reenviar el código');
            }

            setTimeLeft(900);
            setCanResend(false);
            setVerificationCode(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();

            // Feedback visual
            gsap.to(formRef.current, {
                scale: 1.02,
                duration: 0.2,
                yoyo: true,
                repeat: 1
            });
        } catch (err: unknown) {
            if(err instanceof Error) {
                setFormError(err.message || 'Error al reenviar el código');
            }
            else {
                setFormError(String(err) || 'Error al reenviar el código');
            }
        }
    };

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <div
            ref={containerRef}
            className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black overflow-hidden"
        >
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:64px_64px]"></div>

            <div className="absolute top-10 left-10 z-10">
                <h1 className="text-5xl font-black leading-none bg-gradient-to-r from-cyan-400 via-blue-400 to-slate-400 bg-clip-text text-transparent">
                    Pyground
                </h1>
            </div>

            <div
                ref={floatingRef1}
                className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse"
            />
            <div
                ref={floatingRef2}
                className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-gradient-to-br from-slate-500/20 to-gray-500/20 rounded-full blur-3xl"
            />
            <div
                ref={floatingRef3}
                className="absolute top-1/3 right-1/4 w-80 h-80 bg-gradient-to-br from-blue-500/15 to-cyan-500/15 rounded-full blur-3xl"
            />

            <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
            <div className="absolute bottom-1/3 right-1/3 w-2 h-2 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute top-2/3 left-1/4 w-2 h-2 bg-slate-400 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>

            <div
                ref={formRef}
                className="relative max-w-md w-full mx-4 space-y-8 p-10 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 z-10"
            >
                <div className="text-center space-y-4">
                    <div className="flex justify-center mb-4">
                        <div className="relative">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <h2
                        ref={titleRef}
                        className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-tight"
                    >
                        Verifica tu email
                    </h2>
                    <p className="text-base text-gray-600 font-medium">
                        Te hemos enviado un código de verificación a:
                    </p>
                    <p className="text-sm font-semibold text-blue-600 break-all">
                        {email}
                    </p>
                </div>

                {formError && (
                    <div className="bg-gradient-to-r from-red-50 to-rose-50 border-l-4 border-red-500 rounded-xl p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <p className="text-sm text-red-700 font-medium">{formError}</p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-4 text-center">
                            Ingresa el código de 6 dígitos
                        </label>
                        <div className="flex gap-3 justify-center">
                            {[0, 1, 2, 3, 4, 5].map((index) => (
                                <input
                                    key={index}
                                    ref={(el) => {
                                        inputRefs.current[index] = el;
                                    }}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={verificationCode[index]}
                                    onChange={(e) => handleCodeChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all bg-white text-gray-900"
                                    placeholder="0"
                                />
                            ))}
                        </div>
                    </div>


                    <button
                        type="submit"
                        disabled={isSubmitting || verificationCode.join('').length !== 6}
                        className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold text-sm rounded-xl shadow-lg hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 relative overflow-hidden group"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Verificando...
                                </>
                            ) : (
                                <>
                                    Verificar código
                                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                                    </svg>
                                </>
                            )}
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>
                </form>

                <div className="pt-4 border-t border-gray-200 space-y-3">
                    <p className="text-center text-sm text-gray-600">
                        ¿No recibiste el código?
                    </p>
                    <button
                        type="button"
                        onClick={handleResendCode}
                        disabled={!canResend || isSubmitting}
                        className="w-full py-2.5 px-4 border-2 border-blue-600 text-blue-600 font-semibold text-sm rounded-lg hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400"
                    >
                        {canResend ? 'Reenviar código' : `Reenviar en ${minutes}:${seconds.toString().padStart(2, '0')}`}
                    </button>
                </div>

                <div className="text-center text-xs text-gray-500 pt-2 border-t border-gray-200">
                    Este es un correo automático, por favor no responder.
                </div>
            </div>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black">
                <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-cyan-200"></div>
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-cyan-500 border-r-transparent border-b-transparent border-l-transparent absolute top-0"></div>
                </div>
            </div>
        }>
            <VerifyEmailContent />
        </Suspense>
    );
}