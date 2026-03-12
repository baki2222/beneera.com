import AdminProductEditPage from '../[id]/page';

export default function AdminNewProductPage() {
  return <AdminProductEditPage params={Promise.resolve({ id: 'new' })} />;
}
