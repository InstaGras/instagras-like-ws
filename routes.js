function getAllLikesOfPublication(req, response, client){
	const id = req.params.id;
	const likeSelectionQuery = {
		text: 'select count (*) FROM "like"."likes" where "like"."likes"."publication_id" = $1',
		values: [id]
	}
	client.query(likeSelectionQuery, (err, res) => {
		if (err) {
			response.send({
				success: false,
				code: 400,
				message: 'Error : ' + err
			});
		} else {
				response.send({
					success: true,
					code: 200,
					data : res.rowCount
				})
			}
		}
	);
}

function getLikeOfOneUserForOnePublication(req, response, client){
	const username = req.params.username;
	const id = req.params.id;
	const likeSelectionQuery = {
		text: 'SELECT * FROM "like"."likes" where "like"."likes"."publication_id" = $1 and "like"."likes"."username" = $2',
		values: [id, username]
	}
	client.query(likeSelectionQuery, (err, res) => {
		if (err) {
			response.send({
				success: false,
				code: 400,
				message: 'Error while getting the like '+ id +' in db.'
			});
		} else {
			const rows = res.rows;
			if(rows[0] != undefined){
				response.send({
					success: false,
					code: 400,
					data : false
					
				});
			} else {
				response.send({
					success: true,
					code: 200,
					data : true
				});
			}
		}
	});
}

function likePublication(req,response, client){
	const username = req.body.username;
	const publication_id = req.body.publication;

	const alreadyExist = {
		text: 'Select * From "like"."likes" where publication_id = $1 and username = $2',
		values: [publication_id, username]
	}

	client.query(alreadyExist, (err, res) => {
		if (err) {
			response.send({
				success: false,
				code: 400,
				message: 'Error while getting the like in db.'
			});
		} else {
			const rows = res.rows;
			if(rows[0] == undefined){
				const likeInsertionQuery = {
					text: 'INSERT INTO "like"."likes"(publication_id, username) values ($1,$2)',
					values: [publication_id, username]
				}
				client.query(likeInsertionQuery, (err, res) => {
					if (err) {
						response.send({
							success: false,
							code: 400,
							message: "Error during like creation : " 
						});
					} else {
						response.send({
							success: true,
							code: 200,
							message: 'The like has been created',
						});
					}
				})				
			} else {
				const likeDeletionQuery = {
					text: 'DELETE from "like"."likes" WHERE publication_id = $1 and username = $2',
					values: [publication_id, username]
				}
			
				client.query(likeDeletionQuery, (err, res) => {
					if (err) {
						response.send({
							success: false,
							code: 400,
							message: "Error during like deletion : " + err 
						});
					} else {
						response.send({
							success: true,
							code: 200,
							message: 'The like has been deleted',
						});
					}
				})
			}
		}
	});

function undoLike(req, response, client){

	console.log(req.body);

	const username = req.body.username;
	const publication_id = req.body.publication;

	console.log(username);

	const publicationDeletionQuery = {
		text: 'DELETE from "like"."likes" where "like"."likes"."publication_id" = $1 and "like"."likes"."username" = $2',
		values: [publication_id, username]
	}
	client.query(publicationDeletionQuery, (err, res) => {
		if (err) {
			response.send({
				success: false,
				code: 400,
				message: "Error during like deletion."
			});
		} else {
			response.send({
				success: true,
				code: 200,
				message: 'The like has been deleted',
			});
		}
	})
};


function getCurrentDate(){
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth() + 1; //January is 0!
	var yyyy = today.getFullYear();
	if (dd < 10) {
 		 dd = '0' + dd;
	} 
	if (mm < 10) {
 		 mm = '0' + mm;
	} 
	var today = dd + '/' + mm + '/' + yyyy;
	return today;
}

module.exports = {
	getAllLikesOfPublication,
	getLikeOfOneUserForOnePublication,
	likePublication,
	undoLike
}