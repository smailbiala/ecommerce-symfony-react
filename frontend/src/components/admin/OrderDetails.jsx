import { useState } from "react";

const OrderDetails = ({ order, onClose, onUpdateStatus }) => {
  const [newStatus, setNewStatus] = useState(order.status);

  const handleStatusChange = (e) => {
    setNewStatus(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateStatus(order.id, newStatus);
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="flex justify-between items-center p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold">Détails de la commande #{order.id}</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Informations client</h3>
            <p>
              <span className="font-medium">Nom:</span>{" "}
              {order.user
                ? `${order.user.firstName} ${order.user.lastName}`
                : "Utilisateur inconnu"}
            </p>
            <p>
              <span className="font-medium">Email:</span>{" "}
              {order.user ? order.user.email : "N/A"}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Informations commande</h3>
            <p>
              <span className="font-medium">Date:</span>{" "}
              {new Date(order.createdAt).toLocaleDateString()}
            </p>
            <p>
              <span className="font-medium">Statut:</span>{" "}
              <span
                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                ${
                  order.status === "paid"
                    ? "bg-green-100 text-green-800"
                    : order.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : order.status === "cancelled"
                    ? "bg-red-100 text-red-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {order.status}
              </span>
            </p>
            <p>
              <span className="font-medium">Total:</span> {order.total.toFixed(2)} €
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Adresse de livraison</h3>
          <p>{order.shippingAddress || "Non spécifiée"}</p>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Produits commandés</h3>
          <div className="bg-gray-50 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prix unitaire
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantité
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {order.orderItems.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {item.product.imageUrl && (
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="w-10 h-10 object-cover rounded mr-3"
                          />
                        )}
                        <span>{item.product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.product.price.toFixed(2)} €
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {(item.product.price * item.quantity).toFixed(2)} €
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="border-t border-gray-200 pt-6">
          <div className="flex flex-col md:flex-row md:items-end gap-4">
            <div className="flex-1">
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Mettre à jour le statut
              </label>
              <select
                id="status"
                value={newStatus}
                onChange={handleStatusChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="pending">En attente</option>
                {/* <option value="processing">En traitement</option>
                <option value="shipped">Expédiée</option> */}
                {/* <option value="delivered">Livrée</option> */}
                <option value="paid">Payée</option>
                <option value="cancelled">Annulée</option>
              </select>
            </div>
            <button
              type="submit"
              className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded"
            >
              Mettre à jour
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderDetails;