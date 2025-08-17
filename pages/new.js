import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function NewPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/exercises/new');
  }, [router]);
  return null;
}
