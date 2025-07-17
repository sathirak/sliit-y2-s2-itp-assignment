
import { createFileRoute } from '@tanstack/react-router'
import Home from '../modules/home/pages/Home'

export const Route = createFileRoute('/')({
  component: Home,
})