import React from 'react';

export default function FoodMenuSkeleton({ isMobile = false }) {
  if (isMobile) {
    return (
      <div className="flex flex-col w-full max-w-[440px] mx-auto px-4 pb-10 text-on-surface animate-fadeIn">
        <style>{`
          @keyframes warmShimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          .skeleton-shimmer {
            position: relative;
            overflow: hidden;
          }
          .skeleton-shimmer::after {
            content: "";
            position: absolute;
            top: 0; right: 0; bottom: 0; left: 0;
            transform: translateX(-100%);
            background: linear-gradient(
              90deg,
              rgba(255, 255, 255, 0) 0%,
              rgba(255, 255, 255, 0.45) 50%,
              rgba(255, 255, 255, 0) 100%
            );
            animation: warmShimmer 1.8s infinite ease-in-out;
          }
          @keyframes pulseWarm {
            0%, 100% { opacity: 0.95; }
            50% { opacity: 0.55; }
          }
          .pulse-warm {
            animation: pulseWarm 2.2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
        `}</style>

        {/* 1. Category Deck & Sensory Filter Rails */}
        <div className="flex flex-col gap-2 py-2">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <div className="flex-shrink-0 px-3.5 py-2 rounded-xl bg-charcoal-ink flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary-fixed-dim"></div>
              <div className="h-3 w-14 bg-surface-container-low/80 rounded-full skeleton-shimmer"></div>
            </div>
            {[16, 20, 14, 16].map((w, idx) => (
              <div key={idx} className="flex-shrink-0 px-3.5 py-2 rounded-xl bg-surface-container flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded-full bg-surface-container-highest skeleton-shimmer"></div>
                <div className={`h-3 w-${w} bg-surface-container-highest rounded-full skeleton-shimmer`}></div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <div className="h-7 px-2.5 rounded-lg bg-surface-container-low flex items-center gap-1.5 shadow-sm">
                <div className="w-3 h-3 rounded-sm bg-botanical-sage/40 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-botanical-sage"></div>
                </div>
                <div className="h-2.5 w-12 bg-surface-container-high rounded-full skeleton-shimmer"></div>
              </div>
              <div className="h-7 px-2.5 rounded-lg bg-surface-container-low flex items-center gap-1.5 shadow-sm">
                <span className="material-symbols-outlined text-[13px] text-raw-ochre">local_fire_department</span>
                <div className="h-2.5 w-14 bg-surface-container-high rounded-full skeleton-shimmer"></div>
              </div>
            </div>
            <div className="h-2.5 w-16 bg-surface-container-high rounded-full skeleton-shimmer"></div>
          </div>
        </div>

        {/* 2. Mobile Dish Card Skeleton List */}
        <section className="flex flex-col gap-4 pt-3">
          {[0, 140, 280, 420].map((delay, index) => (
            <article 
              key={index}
              className="w-full bg-surface-container-lowest rounded-xl p-3 flex flex-col gap-3 shadow-sm pulse-warm"
              style={{ animationDelay: `${delay}ms` }}
            >
              <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden bg-surface-container-high skeleton-shimmer">
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <div className="h-5 px-2 rounded bg-surface/90 backdrop-blur-sm flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-clay-terracotta"></div>
                    <div className="h-2 w-16 bg-surface-container-highest rounded-full skeleton-shimmer"></div>
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-surface-container-lowest/90 px-2 py-0.5 rounded shadow-sm">
                  <span className="material-symbols-outlined text-[13px] text-raw-ochre">star</span>
                  <div className="h-2.5 w-6 bg-surface-container-highest rounded-full skeleton-shimmer"></div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 px-0.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="h-4 w-3/5 bg-surface-container-highest rounded skeleton-shimmer"></div>
                  <div className="h-4 w-12 bg-surface-container-high rounded skeleton-shimmer"></div>
                </div>
                <div className="h-2.5 w-2/5 bg-surface-container-high rounded-full skeleton-shimmer"></div>
                <div className="flex flex-col gap-1 pt-1">
                  <div className="h-2.5 w-full bg-surface-container rounded-full skeleton-shimmer"></div>
                  <div className="h-2.5 w-4/5 bg-surface-container rounded-full skeleton-shimmer"></div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 px-0.5">
                <div className="flex items-center gap-1.5">
                  <div className="h-5 px-2 rounded bg-surface-container flex items-center">
                    <div className="h-2 w-12 bg-surface-container-highest rounded-full skeleton-shimmer"></div>
                  </div>
                </div>
                <div className="h-8 px-4 rounded bg-charcoal-ink flex items-center justify-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-surface">add</span>
                  <div className="h-2.5 w-8 bg-surface/70 rounded skeleton-shimmer"></div>
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
    );
  }

  // DESKTOP SKELETON
  return (
    <div className="w-full max-w-[1440px] mx-auto px-6 lg:px-12 py-8 animate-fadeIn">
      <style>{`
        @keyframes zaykaShimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .sk-shimmer {
          background: linear-gradient(90deg, #eee7dc 0%, #f7f2ea 45%, #eee7dc 90%);
          background-size: 250% 100%;
          animation: zaykaShimmer 2.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        .sk-shimmer-subtle {
          background: linear-gradient(90deg, #f4ede2 0%, #ffffff 50%, #f4ede2 100%);
          background-size: 250% 100%;
          animation: zaykaShimmer 2.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        .sk-shimmer-dark {
          background: linear-gradient(90deg, #e0d9cf 0%, #ece5dc 50%, #e0d9cf 100%);
          background-size: 250% 100%;
          animation: zaykaShimmer 2.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}</style>

      {/* Section Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-sandborder/60">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest text-clay-terracotta font-semibold">Seasonal Registry</span>
            <span className="text-gray-400 text-xs">—</span>
            <div className="h-2.5 w-24 sk-shimmer rounded"></div>
          </div>
          <div className="h-8 w-72 sm:w-96 sk-shimmer-dark rounded"></div>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-3 w-28 sk-shimmer rounded"></div>
          <div className="w-8 h-8 rounded-full bg-surface-container shadow-sm flex items-center justify-center">
            <span className="material-symbols-outlined text-sm text-gray-400">grid_view</span>
          </div>
        </div>
      </div>

      {/* Bento Cards Grid (8 Cards: 4 Cols x 2 Rows) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
          <div key={i} className="bg-white shadow-sm rounded-xl overflow-hidden flex flex-col justify-between border border-sandborder">
            <div className="relative w-full aspect-[4/3] sk-shimmer overflow-hidden">
              <div className="absolute top-3 left-3 flex flex-col gap-1">
                <div className="px-2 py-1 bg-white/90 backdrop-blur-sm w-16 h-4 rounded shadow-sm">
                  <div className="w-full h-full sk-shimmer-dark rounded"></div>
                </div>
              </div>
              <div className="absolute bottom-3 right-3 w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-xs text-gray-400">favorite</span>
              </div>
            </div>
            <div className="p-4 flex flex-col flex-1 justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="h-3 w-20 sk-shimmer rounded"></div>
                  <div className="h-3 w-8 sk-shimmer-dark rounded"></div>
                </div>
                <div className="h-5 w-4/5 sk-shimmer-dark rounded"></div>
                <div className="space-y-1 pt-1">
                  <div className="h-3 w-full sk-shimmer-subtle rounded"></div>
                  <div className="h-3 w-3/4 sk-shimmer-subtle rounded"></div>
                </div>
              </div>
              <div className="pt-2 flex items-center justify-between gap-3 border-t border-sandborder/50">
                <div className="space-y-1">
                  <div className="h-2.5 w-8 sk-shimmer rounded"></div>
                  <div className="h-5 w-16 sk-shimmer-dark rounded"></div>
                </div>
                <div className="h-8 w-24 sk-shimmer-dark rounded shadow-sm"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
