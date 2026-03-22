"use client";

import { motion } from "framer-motion";
import { Shield, Users, Award, Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
    return (
        <div className="bg-surface-50 min-h-screen pt-24 pb-12">
            {/* Mission Section */}
            <section className="container mx-auto px-4 mb-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-outfit font-black tracking-tighter mb-8 text-surface-950">
                            DRIVING <span className="text-brand-600">EXCELLENCE</span> SINCE 1998
                        </h1>
                        <p className="text-xl text-surface-600 font-medium mb-6 leading-relaxed">
                            Apex Auto Parts was founded with a single mission: to provide vehicle owners and professional mechanics with the highest quality motor spare parts at competitive prices.
                        </p>
                        <p className="text-surface-600 font-medium leading-relaxed">
                            With over two decades of experience in the automotive industry, we have built a reputation for reliability, expertise, and unparalleled customer service. We source our parts directly from leading OEM manufacturers to ensure that every component you buy meets the most stringent quality standards.
                        </p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-surface-200"
                    >
                        <Image
                            src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=1200"
                            alt="Mechanic working on car"
                            fill
                            className="object-cover"
                        />
                    </motion.div>
                </div>
            </section>

            {/* Values Section */}
            <section className="bg-white py-24 mb-24 border-y border-surface-200">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-outfit font-black text-surface-950 mb-4">OUR CORE VALUES</h2>
                        <div className="w-24 h-1.5 bg-brand-600 mx-auto rounded-full" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Shield,
                                title: "Quality Guaranteed",
                                desc: "Every part undergoes rigorous testing to ensure it meets or exceeds OEM performance standards."
                            },
                            {
                                icon: Users,
                                title: "Expert Support",
                                desc: "Our team consists of automotive enthusiasts and technicians ready to help you find the perfect fit."
                            },
                            {
                                icon: Award,
                                title: "Industry Specialists",
                                desc: "We specialize in performance and replacement parts for all major European and Japanese makes."
                            }
                        ].map((value, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-surface-50 p-8 rounded-xl border border-surface-200 text-center group hover:border-brand-300 transition-colors"
                            >
                                <div className="w-16 h-16 bg-brand-50 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                    <value.icon className="text-brand-600" size={32} />
                                </div>
                                <h3 className="text-2xl font-bold font-outfit text-surface-950 mb-4">{value.title}</h3>
                                <p className="text-surface-600 font-medium">{value.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="container mx-auto px-4 mb-12">
                <div className="bg-surface-950 rounded-[3rem] p-12 md:p-24 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-brand-600 rounded-full blur-[150px] opacity-20" />

                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16">
                        <div>
                            <h2 className="text-4xl md:text-6xl font-outfit font-black tracking-tight mb-8">
                                GET IN TOUCH <span className="text-brand-500">WITH OUR TEAM</span>
                            </h2>
                            <p className="text-surface-400 text-lg mb-12">
                                Have questions about fitment or availability? Our regional distribution centers are ready to assist you with your order.
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <MapPin className="text-brand-500" />
                                    <span className="text-lg">123 Autoway Industrial Park, Chicago, IL</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Phone className="text-brand-500" />
                                    <span className="text-lg">+1 (800) APEX-AUTO</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Mail className="text-brand-500" />
                                    <span className="text-lg">support@apexautoparts.com</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-surface-900/50 backdrop-blur-md p-8 rounded-2xl border border-surface-800">
                            <form className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-surface-400 uppercase tracking-widest">Name</label>
                                        <input type="text" className="w-full bg-surface-950 border border-surface-800 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-500 transition-colors" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-surface-400 uppercase tracking-widest">Email</label>
                                        <input type="email" className="w-full bg-surface-950 border border-surface-800 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-500 transition-colors" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-surface-400 uppercase tracking-widest">Message</label>
                                    <textarea rows={4} className="w-full bg-surface-950 border border-surface-800 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-500 transition-colors resize-none"></textarea>
                                </div>
                                <button className="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white font-black rounded-xl transition-all active:scale-95 shadow-lg shadow-brand-600/20 uppercase tracking-widest">
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
