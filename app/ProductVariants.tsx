import { type CatalogProduct, type CatalogVariant } from "./catalog-data";

export default function ProductVariants({ product, variant, onChange }: {
  product: CatalogProduct;
  variant: CatalogVariant;
  onChange: (id: string) => void;
}) {
  if (product.variants.length < 2) return null;
  return <fieldset className="product-variants">
    <legend>Pilih varian <span>· {product.variants.length} pilihan</span></legend>
    <div className="product-variant-options">
      {product.variants.map(option => <button type="button" key={option.id}
        className={option.id === variant.id ? "product-variant active" : "product-variant"}
        aria-label={`${product.title} — ${option.label}`}
        aria-pressed={option.id === variant.id}
        onClick={() => onChange(option.id)}>
        {(option.id === "red" || option.id === "white") && <i className={`variant-swatch swatch-${option.id}`} aria-hidden="true" />}
        {option.label}<span className="variant-check" aria-hidden="true">{option.id === variant.id ? "✓" : "+"}</span>
      </button>)}
    </div>
  </fieldset>;
}
