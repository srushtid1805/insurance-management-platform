function CustomerPage(){
    return(
        <div>
            <h1>Insurance Management System</h1>

            <hr />
        
            <h2>Customer Management</h2>

            <button>Add Customer</button>

            <table border = "1" cellPadding="10">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Address</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>Srushti Deshpande</td>
                        <td>srushti@gmail.com</td>
                        <td>9999999999</td>
                        <td>Mumbai</td>
                        <td>
                            <button>Edit</button>
                            <button>Delete</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default CustomerPage;