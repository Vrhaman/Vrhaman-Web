'use server';

import SingleObject from '@/components/SingleObject';
import axios from 'axios';

export async function generateStaticParams() {
    try {
        const response = await axios.get(`http://localhost:8000/market/get-products`);

        if (response.data && response.data.success) {
            console.log("Products fetched");

            const paths = response.data.products.map(product => ({
                id: [product._id.toString()]
            }));

            return paths;
        } else {
            console.error("Error in fetching products data");
            return [];
        }
    } catch (error) {
        console.error("Error getting data:", error);
        return [];
    }
}

export async function generateMetadata({ params }) {
    const { id } = params;
    return {
        title: `Explore ${id}`,
    };
}

// Ensure the Page component is async
export default async function Page({ params }) {
    const { id } = params;

    return <SingleObject id={id} />;
}
