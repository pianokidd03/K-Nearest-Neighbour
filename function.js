$( document ).ready(function() {
	$.getJSON("ratings.json", function(ratings) {   
	    $.getJSON("movies.json", function(movies) {
	    	$.getJSON("keyedMovies.json", function(keyedMovies) {

		    	$("#returnBtn").click(function() {

		    		var chosenUser = document.getElementById('userId1').value;

				    function euclideanDis(user1Id, user2Id){
					    // finds all the movies user1 has rated and keeps the movie id and its rating in an array
					    var user1Movies = [];
					    for (var i = 0; i < ratings.length; i++) {
					    	if (ratings[i]['userId'] == user1Id){
					    		duplet = [];
					    		duplet.push(ratings[i]['movieId']);
					    		duplet.push(ratings[i]['rating']);
					    		user1Movies.push(duplet);
					    	} 
					    }

					    // finds all the movies user2 has rated and keeps the movie id and its rating in an array
					    var user2Movies = [];
					    for (var i = 0; i < ratings.length; i++) {
					    	if (ratings[i]['userId'] == user2Id){
					    		duplet = [];
					    		duplet.push(ratings[i]['movieId']);
					    		duplet.push(ratings[i]['rating']);
					    		user2Movies.push(duplet);
					    	} 
					    }
					    
					    /* finds the common movies the users 
					    have rated and exports them as an array*/
					    var similarities_user1 = [];
					    var similarities_user2 = [];
					    var sumSquares = 0;
					    for (var i = 0; i < user1Movies.length; i++) {
					    	for (var a = 0; a < user2Movies.length; a++) {
					    		if (user1Movies[i][0] === user2Movies[a][0]){
					    			var rating1 = user1Movies[i][1];
					    			var rating2 = user2Movies[a][1];
					    			var diff = rating1 - rating2;
					    			sumSquares += diff * diff;
					    		}
					    	}
					    }

					    // Finds the similarity score using a^2 + b^2 = c^2
					    var euclDist = Math.sqrt(sumSquares);
					    var simScore = 1/(euclDist + 1);

					    return simScore;
					}   

					// Because the json data is not keyed this mini-algoithm finds all the users and what their ids are.
					function uniqueUsers(rawJson) {
						var allIds = [];
						for (var i = 0; i < rawJson.length; i++) {
							allIds.push(rawJson[i]['userId']);
						}

						var uniqueIds = [];
						$.each(allIds, function(i, el){
						    if($.inArray(el, uniqueIds) === -1) uniqueIds.push(el);
						});

						return uniqueIds
					}
			    	
			    	/* Interates through the euclideanDis function and compares 
			    	the entered user ID to all other users and finds the most similar*/
			    	var allUsers = uniqueUsers(ratings);
			    	var numOfUsers = allUsers.length;
			    	var userIdToCompare = chosenUser; // important
			    	const allSimScores = new Map();
			    	for (var i = 0; i < numOfUsers; i++) {
			    		if(userIdToCompare !== i+1){
			    			// allSimScores[allUsers[i]] = euclideanDis(userIdToCompare, allUsers[i]);
			    			allSimScores.set(allUsers[i], euclideanDis(userIdToCompare, allUsers[i]));
			    		}
			    	}

			    	const sortedByVal = new Map([...allSimScores.entries()].sort((a, b) => b[1] - a[1]));

			    	var iterator = sortedByVal[Symbol.iterator]();

			    	// Finds the K most liked movies (guess)
			    	var k = 5;

			    	for (var i = 0; i < k; i++) {
			    		if (iterator.next().value[0] !== chosenUser){
				    		var simUserId = ratings[iterator.next().value[0]];
				    		console.log(keyedMovies[simUserId['movieId']]);
				    	}
			    	}

		    	});
		    });
		});
	});
});