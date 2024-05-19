function deleteProduct(event) {
    const productId = event.parentNode.querySelector('input[name="productId"]').value;
    const csrf = event.parentNode.querySelector('input[name="_csrf"]').value;

    const result = fetch(`/admin/product/${productId}`, {
        method: 'DELETE',
        headers: {
            'csrf-token': csrf
        }
    })
    .then(result => {
        document.querySelector(`[data-product-id="${productId}"]`).remove();
        return result.json();
    }).catch(err => {
            console.log(err);
    });
}

function deleteCategory(event) {
    const categoryId = event.parentNode.querySelector('input[name="categoryId"]').value;
    const csrf = event.parentNode.querySelector('input[name="_csrf"]').value;

    const result = fetch(`/admin/category/${categoryId}`, {
        method: 'DELETE',
        headers: {
            'csrf-token': csrf
        }
    })
        .then(result => {
            document.querySelector(`[data-category-id="${categoryId}"]`).remove();
            return result.json();
        })
        .catch(err => {
            console.log(err);
        });
}