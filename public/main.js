function deleteProduct(id){
    let val=confirm("Do you want to delete the product ?");
    if(val){
        fetch(`/delete/&{id}`, {
            method: "POST"
        }).then((res)=>{
            if(res.ok){
                location.reload();
            }
        })
    }
}