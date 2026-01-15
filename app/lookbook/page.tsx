import { redirect } from 'next/navigation';

/**
 * Lookbook is now the Ritual Registry.
 * Redirect to the new institutional registry page.
 */
export default function LookbookPage() {
  redirect('/registry');
}
