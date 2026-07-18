import { useState } from "react";
import type { Product, CheckoutItem, AppScreen } from "../types";
import { SEED_PRODUCTS } from "../data/products";
import { HomePaymentsPage } from "../pages/HomePaymentsPage";
import { HomeProductosPage } from "../pages/HomeProductosPage";
import { TusProductosPage } from "../pages/TusProductosPage";
import { CreateProductPage } from "../pages/CreateProductPage";
import { SuccessSheet } from "../pages/SuccessSheet";
import { CobroPage } from "../pages/CobroPage";
import { ProductDetailPage } from "../pages/ProductDetailPage";
import { ProductosACobrarPage } from "../pages/ProductosACobrarPage";
import { DetallePage } from "../pages/DetallePage";
import { MediosDePagoPage } from "../pages/MediosDePagoPage";
import { AcercaInsertaPage } from "../pages/AcercaInsertaPage";
import { CobroExitosoPage } from "../pages/CobroExitosoPage";
import { OperatorShell } from "./OperatorShell";
import { BookingSite } from "../pages/BookingSite";

function OperatorApp() {
  const [appMode] = useState<'agenda' | 'pos'>('agenda');
  const [screen, setScreen] = useState<AppScreen>("home-payments");
  const [products, setProducts] = useState<Product[]>(SEED_PRODUCTS);
  const [cobroDefaultTab, setCobroDefaultTab] = useState<"monto" | "productos">("monto");
  const [cobroBackScreen, setCobroBackScreen] = useState<AppScreen>("home-productos");
  const [checkoutItems, setCheckoutItems] = useState<CheckoutItem[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [celebrateFirst, setCelebrateFirst] = useState(false);
  const [lastCreated, setLastCreated] = useState<Product | null>(null);
  const [formName, setFormName] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formHasPhoto, setFormHasPhoto] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const handleSave = (name: string, price: string, hasPhoto: boolean) => {
    if (editingProductId) {
      setProducts((prev) => prev.map((p) =>
        p.id === editingProductId ? { ...p, name, price, hasPhoto } : p
      ));
      const updated = { id: editingProductId, name, price, hasPhoto };
      setSelectedProduct(updated);
      setEditingProductId(null);
      setScreen("product-detail");
    } else {
      const isFirstReal = !products.some(p => !p.isExample);
      const product: Product = { id: Date.now().toString(), name, price, hasPhoto };
      setProducts((prev) => {
        const base = isFirstReal ? prev.filter(p => !p.isExample) : prev;
        return [...base, product];
      });
      setLastCreated(product);
      setCelebrateFirst(isFirstReal);
      setShowSuccess(true);
    }
  };

  const goToCreate = () => {
    setFormName("");
    setFormPrice("");
    setFormHasPhoto(false);
    setEditingProductId(null);
    setShowSuccess(false);
    setScreen("create-product");
  };

  const goToEdit = (product: Product) => {
    setFormName(product.name);
    setFormPrice(product.price);
    setFormHasPhoto(product.hasPhoto || false);
    setEditingProductId(product.id);
    setShowSuccess(false);
    setScreen("create-product");
  };

  const viewProduct = (product: Product) => {
    setSelectedProduct(product);
    setScreen("product-detail");
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter(p => p.id !== productId));
    setScreen("tus-productos");
  };

  const navigateToCobro = (tab: "monto" | "productos", backScreen: AppScreen) => {
    setCobroDefaultTab(tab);
    setCobroBackScreen(backScreen);
    setScreen("cobro");
  };

  if (appMode === 'agenda') {
    return (
      <div className="absolute inset-0 overflow-hidden">
        <OperatorShell />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden bg-white">
      <div
        className="absolute left-0 right-0 overflow-hidden"
        style={{
          top: 'env(safe-area-inset-top, 0px)',
          bottom: 'env(safe-area-inset-bottom, 0px)',
        }}
      >
        {screen === "home-payments" && (
          <HomePaymentsPage
            onProductosYServicios={() => setScreen("home-productos")}
            onCobrar={() => navigateToCobro("monto", "home-payments")}
          />
        )}
        {screen === "home-productos" && (
          <HomeProductosPage
            products={products}
            onBack={() => setScreen("home-payments")}
            onCreateProduct={goToCreate}
            onTusProductos={() => setScreen("tus-productos")}
            onCobrar={() => navigateToCobro("productos", "home-productos")}
          />
        )}
        {screen === "tus-productos" && (
          <TusProductosPage
            products={products}
            onBack={() => setScreen("home-productos")}
            onCreateProduct={goToCreate}
            onContinueToCobro={() => navigateToCobro("productos", "tus-productos")}
            onViewProduct={viewProduct}
          />
        )}
        {screen === "create-product" && (
          <>
            <CreateProductPage
              formName={formName}
              formPrice={formPrice}
              formHasPhoto={formHasPhoto}
              onNameChange={setFormName}
              onPriceChange={setFormPrice}
              onHasPhotoChange={setFormHasPhoto}
              onSave={handleSave}
              editMode={!!editingProductId}
              onBack={() => editingProductId ? setScreen("product-detail") : setScreen("tus-productos")}
              onClose={() => editingProductId ? setScreen("product-detail") : setScreen("tus-productos")}
            />
            {showSuccess && lastCreated && (
              <SuccessSheet
                product={lastCreated}
                celebrate={celebrateFirst}
                onContinue={() => { setShowSuccess(false); setCelebrateFirst(false); setScreen("tus-productos"); }}
                onCreateAnother={() => { setShowSuccess(false); setCelebrateFirst(false); setFormName(""); setFormPrice(""); setFormHasPhoto(false); }}
              />
            )}
          </>
        )}
        {screen === "product-detail" && selectedProduct && (
          <ProductDetailPage
            product={selectedProduct}
            onBack={() => setScreen("tus-productos")}
            onEdit={() => goToEdit(selectedProduct)}
            onClose={() => setScreen("tus-productos")}
            onDelete={() => deleteProduct(selectedProduct.id)}
          />
        )}
        {screen === "cobro" && (
          <CobroPage
            products={products}
            onBack={() => setScreen(cobroBackScreen)}
            defaultTab={cobroDefaultTab}
            onCreateProduct={goToCreate}
            onCobrar={(items) => {
              setCheckoutItems(items);
              setScreen("cobro-productos");
            }}
          />
        )}
        {screen === "cobro-productos" && (
          <ProductosACobrarPage
            initialItems={checkoutItems}
            onBack={() => setScreen("cobro")}
            onClose={() => setScreen("cobro")}
            onContinue={(updatedItems) => {
              setCheckoutItems(updatedItems);
              setScreen("cobro-detalle");
            }}
          />
        )}
        {screen === "cobro-detalle" && (
          <DetallePage
            items={checkoutItems}
            onBack={() => setScreen("cobro-productos")}
            onCobrar={() => setScreen("cobro-medios")}
          />
        )}
        {screen === "cobro-medios" && (
          <MediosDePagoPage
            items={checkoutItems}
            onBack={() => setScreen("cobro-detalle")}
            onDatafono={() => setScreen("cobro-captura")}
          />
        )}
        {screen === "cobro-captura" && (
          <AcercaInsertaPage
            total={checkoutItems.reduce((s, i) => s + i.qty * i.unitPrice, 0)}
            onCancel={() => setScreen("cobro-medios")}
            onSuccess={() => setScreen("cobro-exitoso")}
          />
        )}
        {screen === "cobro-exitoso" && (
          <CobroExitosoPage
            items={checkoutItems}
            onNuevoCobro={() => {
              setCheckoutItems([]);
              navigateToCobro("productos", "home-productos");
            }}
          />
        )}
      </div>
    </div>
  );
}

export default function App() {
  const surface = new URLSearchParams(window.location.search).get('surface') ?? 'operator';
  if (surface === 'booking') {
    return (
      <div className="absolute inset-0 overflow-hidden">
        <BookingSite />
      </div>
    );
  }
  return <OperatorApp />;
}
