import { Button } from "@/components/ui/button"

const products = [
    {
        id: 1,
        name: "Carbon block filter",
        description: "Ideal for Indian water quality reliable & long-lasting.",
        price: "₹500",
        image: "/featured1.png",
    },
    {
        id: 2,
        name: "RO booster pump",
        description: "Maintains steady pressure for peak RO function.",
        price: "₹1,899",
        image: "/featured2.png",
    },
    {
        id: 3,
        name: "RO membrane",
        description: "Purifies water by eliminating salts, metals & microbes.",
        price: "₹1,499",
        image: "/featured3.png",
    },
]

export default function FeaturedProducts() {
    return (
        <section className="py-16 px-4 bg-white">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-blue-600 mb-4">Featured products</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map((product) => (
                        <div key={product.id} className="bg-gray-50 rounded-3xl p-6 border-2 border-blue-200">
                            {/* Product Image */}
                            <div className="mb-6 bg-white rounded-2xl p-4 h-48 flex items-center justify-center">
                                <img
                                    src={product.image || "/placeholder.svg"}
                                    alt={product.name}
                                    className="w-full h-full object-contain"
                                />
                            </div>

                            {/* Product Info */}
                            <div className="mb-6">
                                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                                <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                                <p className="text-2xl font-bold">{product.price}</p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <Button variant="outline" className="flex-1 rounded-full bg-transparent">
                                    Add to cart
                                </Button>
                                <Button className="flex-1 rounded-full bg-blue-600 hover:bg-blue-700">Buy now</Button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-right mt-8">
                    <button className="text-blue-600 hover:text-blue-700 font-medium">View more...</button>
                </div>
            </div>
        </section>
    )
}
