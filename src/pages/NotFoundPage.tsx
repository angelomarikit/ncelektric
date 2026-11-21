import { Link } from 'react-router-dom';
import { PageMeta } from '../components/PageMeta';

export function NotFoundPage() {
  return (
    <main className="section-pad w-full">
      <PageMeta title="Page not found | NC Elektric" description="The requested page could not be found." path="/404" />
      <h1 className="text-3xl font-black">Page not found</h1>
      <Link to="/" className="btn btn-yellow mt-6 inline-flex">
        Return home
      </Link>
    </main>
  );
}