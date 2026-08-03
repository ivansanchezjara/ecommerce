"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

const variants = {
    enter: (direction) => ({
        x: direction > 0 ? 1000 : -1000,
        opacity: 0,
    }),
    center: {
        zIndex: 1,
        x: 0,
        opacity: 1,
    },
    exit: (direction) => ({
        zIndex: 0,
        x: direction < 0 ? 1000 : -1000,
        opacity: 0,
    }),
};

export default function ImageCarousel({ images }) {
    const [[page, direction], setPage] = useState([0, 0]);

    // Calculamos el índice circular
    const imageIndex = Math.abs(page % images.length);

    const paginate = (newDirection) => {
        setPage([page + newDirection, newDirection]);
    };

    if (!images || images.length === 0) return null;

    return (
        <div className="relative w-full max-w-4xl aspect-video mx-auto overflow-hidden rounded-3xl bg-gray-100 shadow-2xl">
            <AnimatePresence initial={false} custom={direction}>
                <motion.div
                    key={page}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 },
                    }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={1}
                    onDragEnd={(e, { offset, velocity }) => {
                        const swipe = Math.abs(offset.x) * velocity.x;
                        if (swipe < -10000) paginate(1);
                        else if (swipe > 10000) paginate(-1);
                    }}
                    className="absolute inset-0 cursor-grab active:cursor-grabbing"
                >
                    <Image
                        src={images[imageIndex]}
                        alt={`Slide ${imageIndex}`}
                        fill
                        className="object-cover pointer-events-none"
                        priority
                    />
                </motion.div>
            </AnimatePresence>

            {/* Botones de Navegación */}
            <button
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/30 backdrop-blur-md rounded-full hover:bg-white/50 transition-colors"
                onClick={() => paginate(-1)}
            >
                <ChevronLeft className="text-white" size={30} />
            </button>
            <button
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/30 backdrop-blur-md rounded-full hover:bg-white/50 transition-colors"
                onClick={() => paginate(1)}
            >
                <ChevronRight className="text-white" size={30} />
            </button>

            {/* Indicadores (Puntos) */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                {images.map((_, i) => (
                    <div
                        key={i}
                        className={`h-2 w-2 rounded-full transition-all ${i === imageIndex ? "bg-white w-6" : "bg-white/50"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}