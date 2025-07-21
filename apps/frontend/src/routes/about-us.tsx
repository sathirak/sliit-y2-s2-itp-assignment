import { createFileRoute } from '@tanstack/react-router'
import AboutUs from '../modules/home/AboutUs';

export const Route = createFileRoute('/about-us')({
  component: AboutUs,
});


