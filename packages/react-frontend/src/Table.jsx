import React from "react";

function Table(props) {
	  return (
		      <table>
		        <TableHeader />
				<TableBody 
				  characterData={props.characterData}
				  removeCharacter={props.removeCharacter}
				/>
		      </table>
		    );
}

function TableHeader() {
	return (
	  <thead>
		<tr>
		  <th>Unique ID</th>
		  <th>Name</th>
		  <th>Job</th>
		  <th>Remove</th>
		</tr>
	  </thead>
	);
  }

  function TableBody(props) {
	const rows = props.characterData.map((row) => {
      return (
		<tr key={row.id}>
		  <td>{row.id}</td>
		  <td>{row.name}</td>
	      <td>{row.job}</td>
		  <td>
			<button onClick={() => props.removeCharacter(row.id)}>
				Delete
			</button>
		  </td>
		</tr>
	  );
	 }
	);
	return (
		<tbody>
			{rows}
		</tbody>
	);
  }

export default Table;
