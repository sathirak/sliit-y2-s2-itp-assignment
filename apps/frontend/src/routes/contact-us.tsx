import { createFileRoute } from '@tanstack/react-router';
import ContactUs from '../modules/home/pages/ContactUs';

export const Route = createFileRoute('/contact-us')({
  component: ContactUs,
});
