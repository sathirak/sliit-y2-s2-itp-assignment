import { OrderSingle } from '@/modules/user/pages/OrderSingle';

export interface Params {
    id: string;
}


export default async function Page({ params }: { params: Promise<Params> }) {
    const { id } = await params;
    return (
        <OrderSingle id={id} />
    );
}