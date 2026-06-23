import { useState } from 'react';
import { useProducts } from '../hooks/useProducts';

const euros = (cents: number) => (cents / 100).toFixed(2) + ' €';

export const ProductsPage = () => {
  const { products, query, setQuery, add, remove } = useProducts();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [barcode, setBarcode] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('');

  const lookup = async () => {
    const code = barcode.trim();
    if (!code) return;
    const found = await window.api.off.lookup(code);
    if (!found) {
      setMessage('Produit introuvable — saisie manuelle');
      return;
    }
    if (found.name) setName(found.name);
    if (found.brand) setBrand(found.brand);
    if (found.category) setCategory(found.category);
    setMessage('');
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await add({
      name: name.trim(),
      priceCents: Math.round(parseFloat(price) * 100),
      stock: parseInt(stock, 10),
      barcode: barcode.trim() || null,
      brand: brand.trim() || null,
      category: category.trim() || null,
    });
    setName('');
    setPrice('');
    setStock('');
    setBarcode('');
    setBrand('');
    setCategory('');
    setMessage('');
  };

  return (
    <section className="products">
      <h2>Produits</h2>

      <input
        className="search"
        placeholder="Rechercher (nom ou code-barres)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <form className="add-form" onSubmit={submit}>
        <input placeholder="Nom" value={name} onChange={(e) => setName(e.target.value)} required />
        <input placeholder="Prix (€)" type="number" step="0.01" min="0" value={price} onChange={(e) => setPrice(e.target.value)} required />
        <input placeholder="Stock" type="number" min="0" value={stock} onChange={(e) => setStock(e.target.value)} required />
        <div className="barcode-row">
          <input placeholder="Code-barres" value={barcode} onChange={(e) => setBarcode(e.target.value)} />
          <button type="button" onClick={lookup}>Chercher</button>
        </div>
        <input placeholder="Marque" value={brand} onChange={(e) => setBrand(e.target.value)} />
        <input placeholder="Catégorie" value={category} onChange={(e) => setCategory(e.target.value)} />
        {message && <p className="lookup-message">{message}</p>}
        <button type="submit">Ajouter</button>
      </form>

      <table className="product-list">
        <thead>
          <tr><th>Nom</th><th>Prix</th><th>Stock</th><th>Code-barres</th><th></th></tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{euros(p.priceCents)}</td>
              <td>{p.stock}</td>
              <td>{p.barcode ?? '—'}</td>
              <td><button onClick={() => remove(p.id)}>Supprimer</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};
