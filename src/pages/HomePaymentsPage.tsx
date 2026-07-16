import svgPagos from "../imports/Pagos-1/svg-i9dqhgb5zr";
import svgCashReg from "../imports/IconFillIcSale/svg-kot07dyito";
import imgCard from "../imports/Pagos-1/5a728c2f6078cde80c55091bf9f2eb0eeb24968a.png";
import imgCard1 from "../imports/Pagos-1/bfb4d0e5d42f0a85a652d9f2b3f840dc2ef1a0a7.png";
import { StatusBar } from "../components/StatusBar";

export function HomePaymentsPage({ onProductosYServicios, onCobrar }: { onProductosYServicios: () => void; onCobrar: () => void }) {
  return (
    <div className="backdrop-blur-[1px] bg-[#f7f8fb] relative size-full" data-name="Pagos">
      {/* APP Header */}
      <div className="absolute content-stretch flex flex-col gap-[16px] items-center left-0 pb-[12px] rounded-bl-[24px] rounded-br-[24px] top-0 w-full">
        <div className="shrink-0 w-full">
          <StatusBar />
        </div>
        {/* Menu */}
        <div className="relative shrink-0 w-full">
          <div className="flex flex-row items-center size-full">
            <div className="content-stretch flex gap-[56px] items-center px-[16px] relative size-full">
              {/* Profile */}
              <div className="content-stretch flex flex-[1_0_0] gap-[12px] items-center min-w-px py-[8px] relative">
                <div className="bg-[#121e6c] content-stretch drop-shadow-[0px_4px_6px_rgba(18,30,108,0.08)] flex items-center justify-center relative rounded-[100px] shrink-0 size-[40px]">
                  <div className="relative shrink-0 size-[20px]">
                    <div className="absolute inset-[4.17%_10.26%]">
                      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.8945 18.3333">
                        <path d={svgPagos.p3be4d9f0} fill="white" />
                        <path d={svgPagos.p1cd49800} fill="white" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start min-w-px relative">
                  <div className="content-stretch flex items-center relative shrink-0 w-full">
                    <p className="[word-break:break-word] flex-[1_0_0] font-['Montserrat:Semibold',sans-serif] leading-[20px] min-w-px not-italic relative text-[#1e1e1e] text-[14px]">Vinos y vinilos</p>
                  </div>
                  <p className="[word-break:break-word] font-['Montserrat:Regular',sans-serif] font-normal leading-[16px] overflow-hidden relative shrink-0 text-[#606060] text-[12px] text-ellipsis w-full whitespace-nowrap">Calle 123 # 24 - 32, San Vicent</p>
                </div>
              </div>
              {/* Ayuda */}
              <div className="content-stretch flex items-center justify-center relative shrink-0">
                <div className="bg-white content-stretch drop-shadow-[0px_4px_6px_rgba(18,30,108,0.08)] flex gap-[8px] h-[32px] items-center justify-center px-[12px] py-[8px] relative rounded-[100px] shrink-0">
                  <div className="[word-break:break-word] flex flex-col font-['Montserrat:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#121e6c] text-[14px] text-center whitespace-nowrap">
                    <p className="leading-[20px]">Ayuda</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="absolute left-0 top-[120px] bottom-[84px] w-full overflow-y-auto">
        <div className="content-stretch flex flex-col gap-[24px] items-center px-[16px] pb-[16px]">
          {/* Herramientas para vender */}
          <div className="content-stretch flex flex-col gap-[16px] items-start justify-center relative rounded-[16px] shrink-0 w-full">
            <p className="[word-break:break-word] flex-[1_0_0] font-['Montserrat:Bold',sans-serif] font-bold leading-[20px] min-w-px relative text-[#121e6c] text-[16px]">Herramientas para vender</p>
            <div className="content-start flex flex-wrap gap-[8px] items-start relative shrink-0 w-full">
              {/* Cobrar */}
              <div className="content-stretch flex flex-col gap-[8px] items-center min-w-[65px] pt-[2px] relative shrink-0">
                <div className="bg-white content-stretch flex flex-col items-center justify-center p-[4px] relative rounded-[16px] shrink-0 size-[64px]">
                  <div className="relative shrink-0 size-[44px]">
                    <div className="absolute inset-[4.17%]">
                      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40.3333 40.3333">
                        <path clipRule="evenodd" d={svgPagos.p22f20380} fill="#121E6C" fillRule="evenodd" />
                        <path clipRule="evenodd" d={svgPagos.p22f20380} fill="url(#p1_cobrar_a)" fillRule="evenodd" />
                        <path clipRule="evenodd" d={svgPagos.p22f20380} fill="url(#p1_cobrar_b)" fillRule="evenodd" />
                        <defs>
                          <radialGradient cx="0" cy="0" gradientTransform="matrix(21.5716 -16.9007 16.9007 24.0838 3.43676 37.0445)" gradientUnits="userSpaceOnUse" id="p1_cobrar_a" r="1">
                            <stop offset="0.147248" stopColor="#FF2947" /><stop offset="1" stopColor="#FF2947" stopOpacity="0" />
                          </radialGradient>
                          <radialGradient cx="0" cy="0" gradientTransform="matrix(-14.6333 19.2074 -19.2074 -16.3374 39.6417 0.936393)" gradientUnits="userSpaceOnUse" id="p1_cobrar_b" r="1">
                            <stop offset="0.107248" stopColor="#FF2947" /><stop offset="1" stopColor="#FF2947" stopOpacity="0" />
                          </radialGradient>
                        </defs>
                      </svg>
                    </div>
                  </div>
                </div>
                <p className="[word-break:break-word] font-['Montserrat:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#1e1e1e] text-[12px] text-center w-[79.75px]">Cobrar</p>
              </div>
              {/* Simular una venta */}
              <div className="content-stretch flex flex-col gap-[8px] items-center min-w-[65px] pt-[2px] relative shrink-0">
                <div className="bg-white content-stretch flex flex-col items-center justify-center p-[4px] relative rounded-[16px] shrink-0 size-[64px]">
                  <div className="relative shrink-0 size-[44px]">
                    <div className="absolute inset-[2.27%_20.72%_6.06%_20.45%]">
                      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 25.8832 40.3333">
                        <path d={svgPagos.p16ff6d00} fill="#121E6C" />
                        <path d={svgPagos.p16ff6d00} fill="url(#p1_sim_a)" />
                        <path d={svgPagos.p16ff6d00} fill="url(#p1_sim_b)" />
                        <defs>
                          <radialGradient cx="0" cy="0" gradientTransform="matrix(13.8432 -16.9007 10.8457 24.0838 2.20548 37.0445)" gradientUnits="userSpaceOnUse" id="p1_sim_a" r="1">
                            <stop offset="0.147248" stopColor="#FF2947" /><stop offset="1" stopColor="#FF2947" stopOpacity="0" />
                          </radialGradient>
                          <radialGradient cx="0" cy="0" gradientTransform="matrix(-9.39063 19.2074 -12.326 -16.3374 25.4393 0.936393)" gradientUnits="userSpaceOnUse" id="p1_sim_b" r="1">
                            <stop offset="0.107248" stopColor="#FF2947" /><stop offset="1" stopColor="#FF2947" stopOpacity="0" />
                          </radialGradient>
                        </defs>
                      </svg>
                    </div>
                  </div>
                </div>
                <p className="[word-break:break-word] font-['Montserrat:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#1e1e1e] text-[12px] text-center w-[79.75px]">Simular una venta</p>
              </div>
              {/* Links de pago */}
              <div className="content-stretch flex flex-col gap-[8px] items-center min-w-[65px] pt-[2px] relative shrink-0">
                <div className="bg-white content-stretch flex flex-col items-center justify-center p-[4px] relative rounded-[16px] shrink-0 size-[64px]">
                  <div className="relative shrink-0 size-[44px]">
                    <div className="absolute inset-[4.17%_24.22%]">
                      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22.6875 40.3333">
                        <path clipRule="evenodd" d={svgPagos.p1bd7a280} fill="#121E6C" fillRule="evenodd" />
                        <path clipRule="evenodd" d={svgPagos.p1bd7a280} fill="url(#p1_lnk_a)" fillRule="evenodd" />
                        <path clipRule="evenodd" d={svgPagos.p2eeace00} fill="#121E6C" fillRule="evenodd" />
                        <path clipRule="evenodd" d={svgPagos.p2eeace00} fill="url(#p1_lnk_b)" fillRule="evenodd" />
                        <defs>
                          <radialGradient cx="0" cy="0" gradientTransform="matrix(-3.78788 -16.8056 17.9865 4.36729 15.6776 40.3333)" gradientUnits="userSpaceOnUse" id="p1_lnk_a" r="1">
                            <stop offset="0.147248" stopColor="#FF2947" /><stop offset="1" stopColor="#FF2947" stopOpacity="0" />
                          </radialGradient>
                          <radialGradient cx="0" cy="0" gradientTransform="matrix(9.33237 18.7034 -18.0368 0.984205 4.73485 1.44048)" gradientUnits="userSpaceOnUse" id="p1_lnk_b" r="1">
                            <stop offset="0.107248" stopColor="#FF2947" /><stop offset="1" stopColor="#FF2947" stopOpacity="0" />
                          </radialGradient>
                        </defs>
                      </svg>
                    </div>
                  </div>
                </div>
                <p className="[word-break:break-word] font-['Montserrat:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#1e1e1e] text-[12px] text-center w-[79.75px]">Links de pago</p>
              </div>
              {/* QR Pro */}
              <div className="content-stretch flex flex-col gap-[8px] items-center min-w-[65px] pt-[2px] relative shrink-0">
                <div className="bg-white content-stretch flex flex-col items-center justify-center p-[4px] relative rounded-[16px] shrink-0 size-[64px]">
                  <div className="relative shrink-0 size-[44px]">
                    <div className="-translate-y-1/2 absolute aspect-[53.00269317626953/15] left-[12.5%] right-[12.5%] top-[calc(50%+0.19px)]">
                      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 33 9.33915">
                        <path d={svgPagos.p2b2c5680} fill="#32005F" />
                        <path d={svgPagos.p1f7990c0} fill="#32005F" />
                        <path d={svgPagos.p3a153700} fill="#32005F" />
                        <path d={svgPagos.p19052300} fill="#32005F" />
                        <path d={svgPagos.p17f439c0} fill="#32005F" />
                      </svg>
                    </div>
                  </div>
                </div>
                <p className="[word-break:break-word] font-['Montserrat:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#1e1e1e] text-[12px] text-center w-[79.75px]">QR Pro</p>
              </div>
            </div>
          </div>

          {/* Gestión de tu negocio */}
          <div className="content-stretch flex flex-col gap-[16px] items-start justify-center relative rounded-[16px] shrink-0 w-full">
            <p className="[word-break:break-word] flex-[1_0_0] font-['Montserrat:Bold',sans-serif] font-bold leading-[20px] min-w-px relative text-[#121e6c] text-[16px]">Gestión de tu negocio</p>
            <div className="content-start flex flex-wrap gap-[8px] items-start relative shrink-0 w-full">
              {/* Crédito */}
              <div className="content-stretch flex flex-col gap-[8px] items-center min-w-[65px] pt-[2px] relative shrink-0">
                <div className="bg-white content-stretch flex flex-col items-center justify-center p-[4px] relative rounded-[16px] shrink-0 size-[64px]">
                  <div className="relative rounded-[100px] shrink-0 size-[44px]">
                    <div className="absolute inset-[17.92%_4.17%]">
                      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40.3333 28.2333">
                        <path clipRule="evenodd" d={svgPagos.pa600780} fill="#121E6C" fillRule="evenodd" />
                        <path clipRule="evenodd" d={svgPagos.pa600780} fill="url(#p1_cred_a)" fillRule="evenodd" />
                        <defs>
                          <radialGradient cx="0" cy="0" gradientTransform="matrix(21.5716 -11.8305 16.9007 16.8587 3.43676 25.9312)" gradientUnits="userSpaceOnUse" id="p1_cred_a" r="1">
                            <stop offset="0.147248" stopColor="#FF2947" /><stop offset="1" stopColor="#FF2947" stopOpacity="0" />
                          </radialGradient>
                        </defs>
                      </svg>
                    </div>
                  </div>
                </div>
                <p className="[word-break:break-word] font-['Montserrat:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#1e1e1e] text-[12px] text-center w-[79.75px]">Crédito</p>
              </div>
              {/* Saldo de ventas */}
              <div className="content-stretch flex flex-col gap-[8px] items-center min-w-[65px] pt-[2px] relative shrink-0">
                <div className="bg-white content-stretch flex flex-col items-center justify-center p-[4px] relative rounded-[16px] shrink-0 size-[64px]">
                  <div className="relative shrink-0 size-[44px]">
                    <div className="absolute inset-[2.08%_12.03%_4.17%_12.03%]">
                      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 33.4167 41.25">
                        <path clipRule="evenodd" d={svgPagos.p24407e00} fill="url(#p1_saldo_a)" fillRule="evenodd" />
                        <path d={svgPagos.p1df0bdf0} fill="url(#p1_saldo_b)" />
                        <defs>
                          <radialGradient cx="0" cy="0" gradientTransform="matrix(27.1511 -34.2585 34.3943 61.8568 4.06106 37.2299)" gradientUnits="userSpaceOnUse" id="p1_saldo_a" r="1">
                            <stop offset="0.153871" stopColor="#FF2947" /><stop offset="0.695363" stopColor="#121E6C" />
                          </radialGradient>
                          <radialGradient cx="0" cy="0" gradientTransform="matrix(27.1511 -34.2585 34.3943 61.8568 4.06106 37.2299)" gradientUnits="userSpaceOnUse" id="p1_saldo_b" r="1">
                            <stop offset="0.153871" stopColor="#FF2947" /><stop offset="0.695363" stopColor="#121E6C" />
                          </radialGradient>
                        </defs>
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="[word-break:break-word] font-['Montserrat:Medium',sans-serif] font-medium leading-[0] relative shrink-0 text-[#1e1e1e] text-[12px] text-center w-[79.75px]">
                  <p className="leading-[16px] mb-0">Saldo</p>
                  <p className="leading-[16px]">de ventas</p>
                </div>
              </div>
              {/* Historial de ventas */}
              <div className="content-stretch flex flex-col gap-[8px] items-center min-w-[65px] pt-[2px] relative shrink-0">
                <div className="bg-white content-stretch flex flex-col items-center justify-center p-[4px] relative rounded-[16px] shrink-0 size-[64px]">
                  <div className="relative shrink-0 size-[44px]">
                    <div className="absolute inset-[9.94%_9.09%]">
                      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 36 35.2543">
                        <path d={svgPagos.p179ca00} fill="#121E6C" />
                        <path d={svgPagos.p179ca00} fill="url(#p1_hist_a)" />
                        <path d={svgPagos.pf3c05c0} fill="#121E6C" />
                        <path d={svgPagos.pf3c05c0} fill="url(#p1_hist_b)" />
                        <defs>
                          <radialGradient cx="0" cy="0" gradientTransform="matrix(19.254 -14.7725 15.0849 21.051 3.06752 32.3796)" gradientUnits="userSpaceOnUse" id="p1_hist_a" r="1">
                            <stop offset="0.147248" stopColor="#FF2947" /><stop offset="1" stopColor="#FF2947" stopOpacity="0" />
                          </radialGradient>
                          <radialGradient cx="0" cy="0" gradientTransform="matrix(-0.303456 14.9802 -15.6941 -0.842144 22.625 2.62695)" gradientUnits="userSpaceOnUse" id="p1_hist_b" r="1">
                            <stop offset="0.107248" stopColor="#FF2947" /><stop offset="1" stopColor="#FF2947" stopOpacity="0" />
                          </radialGradient>
                        </defs>
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="[word-break:break-word] font-['Montserrat:Medium',sans-serif] font-medium leading-[0] relative shrink-0 text-[#1e1e1e] text-[12px] text-center w-[79.75px] whitespace-pre-wrap">
                  <p className="leading-[16px] mb-0">Historial</p>
                  <p className="leading-[16px]">de ventas</p>
                </div>
              </div>
              {/* Datáfonos */}
              <div className="content-stretch flex flex-col gap-[8px] items-center min-w-[65px] pt-[2px] relative shrink-0">
                <div className="bg-white content-stretch flex flex-col items-center justify-center p-[4px] relative rounded-[16px] shrink-0 size-[64px]">
                  <div className="relative shrink-0 size-[44px]">
                    <div className="absolute bottom-[9.09%] left-1/4 right-[23.66%] top-[9.09%]">
                      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22.5912 36">
                        <path d={svgPagos.p5804700} fill="#121E6C" />
                        <path d={svgPagos.p5804700} fill="url(#p1_dat_a)" />
                        <defs>
                          <radialGradient cx="0" cy="0" gradientTransform="matrix(12.0825 -15.0849 9.46629 21.4963 1.92497 33.0646)" gradientUnits="userSpaceOnUse" id="p1_dat_a" r="1">
                            <stop offset="0.147248" stopColor="#FF2947" /><stop offset="1" stopColor="#FF2947" stopOpacity="0" />
                          </radialGradient>
                        </defs>
                      </svg>
                    </div>
                  </div>
                </div>
                <p className="[word-break:break-word] font-['Montserrat:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#1e1e1e] text-[12px] text-center w-[79.75px]">Datáfonos</p>
              </div>
              {/* Empleados */}
              <div className="content-stretch flex flex-col gap-[8px] items-center min-w-[65px] pt-[2px] relative shrink-0">
                <div className="bg-white content-stretch flex flex-col items-center justify-center p-[4px] relative rounded-[16px] shrink-0 size-[64px]">
                  <div className="relative shrink-0 size-[44px]">
                    <div className="absolute inset-[9.09%_15.43%_9.09%_13.64%]">
                      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 31.211 36">
                        <path d={svgPagos.p12fbc080} fill="#121E6C" />
                        <path d={svgPagos.p12fbc080} fill="url(#p1_emp_a)" />
                        <path d={svgPagos.pea8b280} fill="#121E6C" />
                        <path d={svgPagos.pea8b280} fill="url(#p1_emp_b)" />
                        <defs>
                          <radialGradient cx="0" cy="0" gradientTransform="matrix(16.6927 -15.0849 13.0782 21.4963 2.65946 33.0646)" gradientUnits="userSpaceOnUse" id="p1_emp_a" r="1">
                            <stop offset="0.147248" stopColor="#FF2947" /><stop offset="1" stopColor="#FF2947" stopOpacity="0" />
                          </radialGradient>
                          <radialGradient cx="0" cy="0" gradientTransform="matrix(-3.5 14 -13.2497 -6.19096 20.625 0.5)" gradientUnits="userSpaceOnUse" id="p1_emp_b" r="1">
                            <stop offset="0.107248" stopColor="#FF2947" /><stop offset="1" stopColor="#FF2947" stopOpacity="0" />
                          </radialGradient>
                        </defs>
                      </svg>
                    </div>
                  </div>
                </div>
                <p className="[word-break:break-word] font-['Montserrat:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#1e1e1e] text-[12px] text-center w-[79.75px]">Empleados</p>
              </div>
              {/* Caja registradora */}
              <button
                onClick={onProductosYServicios}
                className="content-stretch flex flex-col gap-[8px] items-center min-w-[65px] pt-[2px] relative shrink-0 cursor-pointer"
              >
                <div className="bg-white content-stretch flex flex-col items-center justify-center p-[4px] relative rounded-[16px] shrink-0 size-[64px]">
                  <div className="relative shrink-0 size-[32px]">
                    <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
                      <g clipPath="url(#clip_cash_home)">
                        <path d={svgCashReg.p1b393980} fill="url(#grad_cash_home)" />
                      </g>
                      <defs>
                        <linearGradient gradientUnits="userSpaceOnUse" id="grad_cash_home" x1="32" x2="-7.98412e-07" y1="16" y2="16">
                          <stop offset="0.149063" stopColor="#FF2947" />
                          <stop offset="0.87985" stopColor="#121E6C" />
                        </linearGradient>
                        <clipPath id="clip_cash_home">
                          <rect fill="white" height="32" width="32" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                </div>
                <div className="content-stretch flex flex-col gap-[2px] items-center relative shrink-0">
                  <div className="[word-break:break-word] font-['Montserrat:Medium',sans-serif] font-medium leading-[0] relative shrink-0 text-[#1e1e1e] text-[12px] text-center w-[79.75px] whitespace-pre-wrap">
                    <p className="leading-[16px] mb-0">Caja</p>
                    <p className="leading-[16px]">registradora</p>
                  </div>
                  <div className="bg-[#ee424e] content-stretch flex items-center justify-center px-[8px] relative rounded-[100px] shrink-0">
                    <div className="[word-break:break-word] flex flex-col font-['Montserrat:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[12px] text-center text-white whitespace-nowrap">
                      <p className="leading-[16px]">Nuevo</p>
                    </div>
                  </div>
                </div>
              </button>
              {/* Métricas del negocio */}
              <div className="content-stretch flex flex-col gap-[8px] items-center min-w-[65px] pt-[2px] relative shrink-0">
                <div className="bg-white content-stretch flex flex-col items-center justify-center p-[4px] relative rounded-[16px] shrink-0 size-[64px]">
                  <div className="relative shrink-0 size-[44px]">
                    <div className="absolute inset-[4.17%_13.99%]">
                      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 31.6905 40.3333">
                        <path d={svgPagos.p72e2380} fill="#121E6C" />
                        <path d={svgPagos.p72e2380} fill="url(#p1_met_a)" />
                        <defs>
                          <radialGradient cx="0" cy="0" gradientTransform="matrix(16.9491 -16.9007 13.2791 24.0838 2.70031 37.0445)" gradientUnits="userSpaceOnUse" id="p1_met_a" r="1">
                            <stop offset="0.147248" stopColor="#FF2947" /><stop offset="1" stopColor="#FF2947" stopOpacity="0" />
                          </radialGradient>
                        </defs>
                      </svg>
                    </div>
                  </div>
                </div>
                <p className="[word-break:break-word] font-['Montserrat:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#1e1e1e] text-[12px] text-center w-[79.75px]">Métricas del negocio</p>
              </div>
            </div>
          </div>

          {/* Novedades */}
          <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
            <p className="[word-break:break-word] flex-[1_0_0] font-['Montserrat:Bold',sans-serif] font-bold leading-[20px] min-w-px relative text-[#121e6c] text-[16px]">Novedades</p>
            <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
              <div className="h-[172px] relative rounded-[16px] shrink-0 w-full">
                <div aria-hidden className="absolute inset-0 pointer-events-none rounded-[16px]">
                  <div className="absolute inset-0 rounded-[16px]" style={{ backgroundImage: "linear-gradient(90deg, rgba(247,248,251,0.2) 0%, rgba(247,248,251,0.2) 100%), linear-gradient(103.24deg, rgba(8,14,255,0.08) 5.486%, rgba(156,155,151,0.04) 73.55%, rgba(8,14,255,0.16) 93.334%), linear-gradient(90deg, #fff 0%, #fff 100%)" }} />
                  <img alt="" className="absolute max-w-none object-cover rounded-[16px] size-full" src={imgCard} />
                  <div className="absolute inset-0 overflow-hidden rounded-[16px]">
                    <img alt="" className="absolute h-[179.03%] left-[38.63%] max-w-none top-[-61.09%] w-[89.51%]" src={imgCard1} />
                  </div>
                </div>
                <div className="content-stretch flex flex-col gap-[16px] items-start p-[16px] relative size-full">
                  <div className="[word-break:break-word] content-stretch flex flex-col gap-[8px] h-[84px] items-start justify-center leading-[0] relative shrink-0 text-[#1e1e1e] w-[172px]">
                    <div className="flex flex-col font-['Montserrat:Bold',sans-serif] font-bold justify-center relative shrink-0 text-[16px] w-full">
                      <p className="leading-[20px]">Gana $50.000 por cada referido</p>
                    </div>
                    <div className="flex flex-col font-['Montserrat:Regular',sans-serif] font-normal justify-center relative shrink-0 text-[12px] w-full">
                      <p className="leading-[16px]">Tu referido también recibe $10.000 al unirse.</p>
                    </div>
                  </div>
                  <div className="backdrop-blur-[4px] bg-[rgba(255,255,255,0.6)] content-stretch flex gap-[8px] h-[40px] items-center justify-center px-[16px] py-[8px] relative rounded-[12px] shrink-0 w-[162px]">
                    <p className="[word-break:break-word] font-['Montserrat:Bold',sans-serif] font-bold leading-[20px] relative shrink-0 text-[#121e6c] text-[14px] text-center whitespace-nowrap">Referir ahora</p>
                  </div>
                </div>
                <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_0px_30.2px_0px_rgba(18,30,108,0.2)]" />
              </div>
              {/* Carousel dots */}
              <div className="content-stretch flex flex-col items-center relative shrink-0 w-full">
                <div className="content-stretch flex gap-[12px] items-center justify-center overflow-clip p-[16px] relative shrink-0 w-[180px]">
                  {[true,false,false,false,false,false].map((active, i) => (
                    <div key={i} className="relative shrink-0 size-[8px]">
                      <svg className="absolute block inset-0 size-full" fill="none" viewBox="0 0 8 8">
                        <circle cx="4" cy="4" fill={active ? "#EE424E" : "#FCDFE2"} r="4" />
                      </svg>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom nav */}
      <div className="absolute backdrop-blur-[1px] bottom-0 content-stretch flex flex-col items-center left-0 pb-[24px] pt-[20px] px-[20px] w-full"
        style={{ backgroundImage: "linear-gradient(0.500163deg, rgb(247,248,251) 50.064%, rgba(247,248,251,0) 98.508%)" }}>
        <div className="h-[62px] relative rounded-[100px] shrink-0 w-full">
          <div aria-hidden className="absolute backdrop-blur-[6px] inset-0 pointer-events-none rounded-[100px]"
            style={{ backgroundImage: "linear-gradient(90deg, rgba(247,248,251,0.2) 0%, rgba(247,248,251,0.2) 100%), linear-gradient(90deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.6) 100%)" }} />
          <div aria-hidden className="absolute border border-[rgba(210,212,225,0.5)] border-solid inset-0 pointer-events-none rounded-[100px] shadow-[0px_10px_18.7px_0px_rgba(18,30,108,0.09)]" />
          <div className="flex flex-row items-center justify-center size-full">
            <div className="content-stretch flex items-center justify-center px-[42px] py-[8px] relative size-full">
              {/* Ventas */}
              <div className="content-stretch flex flex-[1_0_0] flex-col gap-[2px] h-full items-center min-w-px relative">
                <div className="relative shrink-0 size-[24px]">
                  <div className="absolute inset-[4.17%_20.79%]">
                    <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.021 22">
                      <path d={svgPagos.p206800} fill="#121E6C" />
                    </svg>
                  </div>
                </div>
                <p className="[word-break:break-word] font-['Montserrat:SemiBold',sans-serif] font-semibold leading-[16px] relative shrink-0 text-[#121e6c] text-[11px] text-center whitespace-nowrap">Ventas</p>
              </div>
              {/* Cobrar CTA */}
              <button onClick={onCobrar} className="content-stretch flex h-full items-center justify-center relative shrink-0 w-[83.67px] cursor-pointer">
                <div className="bg-[#ff2947] flex-[1_0_0] h-full min-w-px relative rounded-[100px]">
                  <div className="flex flex-row items-center justify-center size-full">
                    <div className="content-stretch flex gap-[8px] items-center justify-center px-[20px] py-[12px] relative size-full">
                      <div className="[word-break:break-word] flex flex-col font-['Montserrat:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[14px] text-center text-white whitespace-nowrap">
                        <p className="leading-[20px]">Cobrar</p>
                      </div>
                    </div>
                  </div>
                </div>
              </button>
              {/* Cuenta */}
              <div className="content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-center min-w-px relative">
                <div className="relative shrink-0 size-[24px]">
                  <div className="absolute inset-[8.72%_3.99%_8.71%_4%]">
                    <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22.082 19.8165">
                      <path d={svgPagos.p1dc44880} fill="#121E6C" />
                      <path d={svgPagos.p3d534980} fill="#121E6C" />
                    </svg>
                  </div>
                </div>
                <div className="[word-break:break-word] flex flex-col font-['Montserrat:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#121e6c] text-[11px] text-center whitespace-nowrap">
                  <p className="leading-[16px]">Cuenta</p>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-2px_4px_0px_white,inset_0px_3px_7.5px_0px_rgba(18,30,108,0.13)]" />
        </div>
      </div>
    </div>
  );
}
