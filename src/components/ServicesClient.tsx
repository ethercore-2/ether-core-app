"use client";

import { Brain, Code2, Search, Palette, ArrowRight } from "lucide-react";
import Link from "next/link";

// ✅ Icons Mapping
const serviceIcons = {
  "AI Automation": Brain,
  "Web Development": Code2,
  "SEO Optimization": Search,
  "UX/UI Design": Palette,
};

// ✅ Define Service Type
interface Service {
  id: number;
  name: string;
  description: string;
}

// ✅ Client Component that receives services as props
export default function ServicesClient({ services }: { services: Service[] }) {
  return (
    <main className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white">Our Digital Solutions</h1>
          <p className="text-xl text-gray-400 mt-4">Transform your business with our cutting-edge services.</p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-4 bg-[#0d1424]">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service) => {
              const IconComponent = serviceIcons[service.name as keyof typeof serviceIcons];
              return (
                <div key={service.id} className="group relative p-8 rounded-xl bg-gradient-to-br from-[#0d2231]/80 to-[#1a2438]/80">
                  <div className="relative mb-8 inline-block">
                    <div className="relative w-16 h-16 flex items-center justify-center bg-gradient-to-br from-teal-500 to-blue-500 rounded-full">
                      {IconComponent && <IconComponent className="w-8 h-8 text-white" />}
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-white">{service.name}</h3>
                  <p className="text-gray-400 mt-4">{service.description}</p>

                  <Link href="/contact" className="text-teal-400 mt-6 inline-flex items-center space-x-2">
                    <span>Get Started</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
