"use client";
import { useId } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { ProductCard } from "@/components/products/ProductsCard";
import { Heading, Text } from "./basics/Typography";
import Button from "./basics/Button";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function ProductsCarousel({
  products,
  title = "Destacados",
  viewAllLink = "/products",
}) {
  const uniqueId = useId().replace(/:/g, "");
  const prevId = `prev-${uniqueId}`;
  const nextId = `next-${uniqueId}`;
  const paginationId = `pagination-${uniqueId}`;

  const limitedProducts = products.slice(0, 10);
  const hasMore = products.length > 10;

  return (
    <section className="pt-4 relative group/carousel">
      <div className="mx-auto px-4">
        <div className="flex flex-row items-baseline mb-4 gap-4">
          <Heading level={3} className="text-xl md:text-2xl">
            {title}
          </Heading>
          <Button
            as={Link}
            href={viewAllLink}
            variant="ghost"
            size="sm"
            icon={ArrowRight}
            iconPosition="right"
            className="text-dental-blue hover:text-dental-blue-hover hover:bg-transparent border-none p-0"
          >
            Ver más
          </Button>
        </div>

        <div className="relative">
          <button id={prevId} className="hidden md:flex absolute top-1/2 -left-4 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-100 text-gray-700 hover:bg-dental-blue hover:text-white items-center justify-center transition-all opacity-0 group-hover/carousel:opacity-100 disabled:opacity-0 cursor-pointer">
            <ChevronLeft size={20} />
          </button>
          <button id={nextId} className="hidden md:flex absolute top-1/2 -right-4 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-100 text-gray-700 hover:bg-dental-blue hover:text-white items-center justify-center transition-all opacity-0 group-hover/carousel:opacity-100 disabled:opacity-0 cursor-pointer">
            <ChevronRight size={20} />
          </button>

          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={16}
            slidesPerView={2}
            slidesPerGroup={2}
            navigation={{ prevEl: `#${prevId}`, nextEl: `#${nextId}` }}
            pagination={{ clickable: true, el: `#${paginationId}` }}
            breakpoints={{
              480: { slidesPerView: 2.2, slidesPerGroup: 2 },
              768: { slidesPerView: 4, slidesPerGroup: 4 },
              1024: { slidesPerView: 5, slidesPerGroup: 5 },
            }}
            className="px-1 py-4"
          >
            {limitedProducts.map((product) => (
              <SwiperSlide key={product.id || product.slug}>
                <Link href={`/products/${product.slug}`} className="block hover:scale-[1.02] transition-transform duration-300 pb-2">
                  <ProductCard product={product} />
                </Link>
              </SwiperSlide>
            ))}

            {hasMore && (
              <SwiperSlide>
                <Link href={viewAllLink} className="flex flex-col items-center justify-center h-full min-h-[200px] bg-white rounded-2xl border-2 border-dashed border-gray-200 hover:border-dental-blue hover:bg-dental-blue-light transition-all group">
                  <div className="w-12 h-12 rounded-full bg-dental-blue-light flex items-center justify-center mb-3 group-hover:bg-dental-blue group-hover:text-white transition-colors text-dental-blue">
                    <Plus size={24} />
                  </div>
                  <Text variant="bodySmBold" className="group-hover:text-dental-blue transition-colors text-center px-4">
                    Ver más
                  </Text>
                </Link>
              </SwiperSlide>
            )}
          </Swiper>
        </div>
        <div id={paginationId} className="flex justify-center gap-2 mt-4"></div>
      </div>
    </section>
  );
}
