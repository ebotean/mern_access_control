const AccessDetails = ({ chosenAccess }) => {
  return (
    <div>
      <h4>User</h4>
      <p><strong>ID:</strong> {chosenAccess?.user.id}</p>
      <p><strong>Name:</strong> {chosenAccess?.user.name}</p>
      <p><strong>Email:</strong> {chosenAccess?.user.email}</p>
      <br />
      <h4>Access</h4>
      <p><strong>Entrance:</strong> {chosenAccess?.createdAt}</p>
      <p><strong>Exit:</strong> {chosenAccess?.updatedAt}</p>
      <p><strong>Status:</strong> {chosenAccess?.status}</p>
      {!!chosenAccess?.message && <p><strong>Message:</strong> {chosenAccess?.message}</p>}
    </div>
  )
}

export default AccessDetails;