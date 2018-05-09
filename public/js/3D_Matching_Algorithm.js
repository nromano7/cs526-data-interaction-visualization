/**
 * 
 */

function generateMatching(s_list,p_list,c_list,a_list,priority_list){
	
	if(s_list.length == 0 || p_list.length == 0 || c_list.length == 0 || a_list.length == 0)
		return null;
	
	var dictionary = {};
	var ret = [];
	
	for(let i = 0; i < a_list.length; i++){
		var temp = []
		for(let j = 1; j < a_list[i].length; j++){
			temp.push(a_list[i][j].substring(1));
		}
		ret.push(temp);
		dictionary[temp] = a_list[i];
	}
	
	var priority = [];
	for(let i = 0; i < priority_list.length; i++){
		var temp = []
		for(let j = 1; j < priority_list[i].length; j++){
			temp.push(priority_list[i][j].substring(1));
		}
		priority.push(temp);
	}
	
	var s_vector = [];
	for(let i = 0; i < s_list.length; i++){
		s_vector.push(0);
	}
	var p_vector = [];
	for(let i = 0; i < p_list.length; i++){
		p_vector.push(0);
	}
	var c_vector = [];
	for(let i = 0; i < c_list.length; i++){
		c_vector.push(0);
	}
	
	function generateNaiveMatching(){
		var matching = [];
		for(let i = 0; i < priority.length; i++){
			matching.push(priority[i]);
			s_vector[parseInt(priority[i][0])] = 1;
			p_vector[parseInt(priority[i][1])] = 1;
			c_vector[parseInt(priority[i][2])] = 1;
		}
		var ret_slice = ret.slice();
		ret_slice = shuffle(ret_slice);
		for(let i = 0; i < ret_slice.length; i++){
			if(s_vector[parseInt(ret_slice[i][0])] == 0 
			&& p_vector[parseInt(ret_slice[i][1])] == 0 
			&& c_vector[parseInt(ret_slice[i][2])] == 0){
				matching.push(ret_slice[i]);
				s_vector[parseInt(ret_slice[i][0])] = 1;
				p_vector[parseInt(ret_slice[i][1])] = 1;
				c_vector[parseInt(ret_slice[i][2])] = 1;
			}
		}
		return matching;
	}
	
	matching = generateNaiveMatching();

	var change = true;
	while(change == true){
		change = false;
		len = matching.length;
		for(let i = priority.length; i < len; i++){
			var removedTup = matching.splice(i,1)[0];
			s_vector[parseInt(removedTup[0])] = 0;
			p_vector[parseInt(removedTup[1])] = 0;
			c_vector[parseInt(removedTup[2])] = 0;
			
			var uncontradicting = [];
			for(let j = 0; j < ret.length; j++){
				if(s_vector[parseInt(ret[j][0])] == 0
				&& p_vector[parseInt(ret[j][1])] == 0
				&& c_vector[parseInt(ret[j][2])] == 0)
					uncontradicting.push(ret[j]);
			}
			
			// buckets[0] = contradict with coord 0
			// buckets[1] = contradict with coord 1
			// buckets[2] = contradict with coord 2
			// buckets[3] = contradict with coord 1 & 2
			// buckets[4] = contradict with coord 0 & 2
			// buckets[5] = contradict with coord 0 & 1
			var buckets = [[],[],[],[],[],[]];
			for(let j = 0; j < uncontradicting.length; j++){
				var contradicts = [false,false,false];
				if(uncontradicting[j][0] == removedTup[0])
					contradicts[0] = true;
				if(uncontradicting[j][1] == removedTup[1])
					contradicts[1] = true;
				if(uncontradicting[j][2] == removedTup[2])
					contradicts[2] = true;
				
				if(contradicts[0] == true 
				&& contradicts[1] == false 
				&& contradicts[2] == false){
					buckets[0].push(uncontradicting[j]);
				}
				else if(contradicts[0] == false 
					 && contradicts[1] == true 
					 && contradicts[2] == false){
					buckets[1].push(uncontradicting[j]);
				}
				else if(contradicts[0] == false 
						 && contradicts[1] == false 
						 && contradicts[2] == true){
						buckets[2].push(uncontradicting[j]);
					}
				else if(contradicts[0] == false 
						 && contradicts[1] == true 
						 && contradicts[2] == true){
						buckets[3].push(uncontradicting[j]);
					}
				else if(contradicts[0] == true 
						 && contradicts[1] == false 
						 && contradicts[2] == true){
						buckets[4].push(uncontradicting[j]);
					}
				else if(contradicts[0] == true 
						 && contradicts[1] == true 
						 && contradicts[2] == false){
						buckets[5].push(uncontradicting[j]);
					}
			}
			
			var best = [];
			var isEmpty = [false,false,false,false,false,false];
			for(let j = 0; j < 6; j++){
				if(buckets[j].length == 0)
					isEmpty[j] = true;
			}
			
			if(!isEmpty[0] && !isEmpty[1] && !isEmpty[2]){
				loop1:
				for(let j = 0; j < buckets[0].length; j++){
					loop2:
					for(let k = 0; k < buckets[1].length; k++){
						loop3:
						for(let l = 0; l < buckets[2].length; l++){
							var contradicts = [false,false,false];
							if(buckets[0][j][2] == buckets[1][k][2])
								contradicts[0] = true;
							if(buckets[0][j][1] == buckets[2][l][1])
								contradicts[1] = true;
							if(buckets[1][k][0] == buckets[2][l][0])
								contradicts[2] = true;
							
							if(!contradicts[0] && !contradicts[1] && !contradicts[2]){
								best.splice(0,best.length,buckets[0][j],buckets[1][k],buckets[2][l]);
								break loop1;
							}
							if(best.length == 2)
								continue;
							
							if(!contradicts[0]){
								best.splice(0,best.length,buckets[0][j],buckets[1][k]);
								continue;
							}
							if(!contradicts[1]){
								best.splice(0,best.length,buckets[0][j],buckets[2][l]);
								continue;
							}
							if(!contradicts[2]){
								best.splice(0,best.length,buckets[1][k],buckets[2][l]);
								continue;
							}
						}
					}
				}
			}
			else if(!isEmpty[0] && !isEmpty[1]){
				loop1:
				for(let j = 0; j < buckets[0].length; j++){
					loop2:
					for(let k = 0; k < buckets[1].length; k++){
						if(buckets[0][j][2] != buckets[1][k][2]){
							best.splice(0,best.length,buckets[0][j],buckets[1][k]);
							break loop1;
						}
					}
				}
			}
			else if(!isEmpty[0] && !isEmpty[2]){
				loop1:
				for(let j = 0; j < buckets[0].length; j++){
					loop2:
					for(let k = 0; k < buckets[2].length; k++){
						if(buckets[0][j][1] != buckets[2][k][1]){
							best.splice(0,best.length,buckets[0][j],buckets[2][k]);
							break loop1;
						}
					}
				}
			}
			else if(!isEmpty[1] && !isEmpty[2]){
				loop1:
				for(let j = 0; j < buckets[1].length; j++){
					loop2:
					for(let k = 0; k < buckets[2].length; k++){
						if(buckets[1][j][0] != buckets[2][k][0]){
							best.splice(0,best.length,buckets[1][j],buckets[2][k]);
							break loop1;
						}
					}
				}
			}
			
			if(best.length < 2){
				for(let j = 0; j < 3; j++){
					if(!isEmpty[j] && !isEmpty[j+3]){
						best.splice(0,best.length,buckets[j][0],buckets[j+3][0]);
						break;
					}
				}
			}
			
			if(best.length >= 2){
				for(let j = 0; j < best.length; j++){
					matching.push(best[j]);
					s_vector[parseInt(best[j][0])] = 1;
					p_vector[parseInt(best[j][1])] = 1;
					c_vector[parseInt(best[j][2])] = 1;
				}
				change = true;
			}
			else{
				matching.push(removedTup);
				s_vector[parseInt(removedTup[0])] = 1;
				p_vector[parseInt(removedTup[1])] = 1;
				c_vector[parseInt(removedTup[2])] = 1;
			}
		}
		// console.log(len + " " + matching.length);
	}
	var final_matching = [];
	for(let i = 0; i < matching.length; i++){
		final_matching.push(dictionary[matching[i]]);
	}
	// console.log(final_matching);
	return final_matching;
}

// order can be either 0,1,2:
//	order = 0 --> student,professor,course
//	order = 1 --> professor,course,student
//	order = 2 --> course,student,professor
function generateDatabaseJSON(a_list,order){
	if(a_list.length == 0 || order < 0 || order > 2)
		return null;
	
	var json = null;
	var orders = [((order+0)%3) + 1,((order+1)%3) + 1,((order+2)%3) + 1]
	json = '{' +
        '"name": "top level",' +
        '"parent": "null",' +
        '"fake": true,' + 
        '"children": [';
	
	var list = a_list.sort(function(a, b){
		var a_storage = [s_dict[a[1]].split(" ")[s_dict[a[1]].split(" ").length-1],p_dict[a[2]].split(" ")[p_dict[a[2]].split(" ").length-1],c_dict[a[3]].split("\t")[0].split(":")[1]];
		var b_storage = [s_dict[b[1]].split(" ")[s_dict[b[1]].split(" ").length-1],p_dict[b[2]].split(" ")[p_dict[b[2]].split(" ").length-1],c_dict[b[3]].split("\t")[0].split(":")[1]];
		if(a_storage[orders[0]-1].localeCompare(b_storage[orders[0]-1]) != 0)
			return a_storage[orders[0]-1].localeCompare(b_storage[orders[0]-1]);
		if(a_storage[orders[1]-1].localeCompare(b_storage[orders[1]-1]) != 0)
			return a_storage[orders[1]-1].localeCompare(b_storage[orders[1]-1]);
		return a_storage[orders[2]-1].localeCompare(b_storage[orders[2]-1]);
		});
	
	var partitions = [];
	if(order == 0){
		var temp = [];
		var char = "A";
		for(let i = 0; i < list.length; i++){
			if(s_dict[list[i][1]].split(" ")[s_dict[list[i][1]].split(" ").length-1].substring(0,1) === char)
				temp.push(list[i]);
			else{
				partitions.push(temp);
				temp = [];
				char = String.fromCharCode(char.charCodeAt(0) + 1);
				i--;
			}
		}
		partitions.push(temp);
	}
	else if(order == 1){
		var temp = [];
		var char = "A";
		for(let i = 0; i < list.length; i++){
			if(p_dict[list[i][2]].split(" ")[p_dict[list[i][2]].split(" ").length-1].substring(0,1) === char)
				temp.push(list[i]);
			else{
				partitions.push(temp);
				temp = [];
				char = String.fromCharCode(char.charCodeAt(0) + 1);
				i--;
			}
		}
		partitions.push(temp);
	}
	else{
		var temp = [];
		var char = "1";
		for(let i = 0; i < list.length; i++){
			if(c_dict[list[i][3]].split("\t")[0].split(":")[1].substring(0,1) === char)
				temp.push(list[i]);
			else{
				partitions.push(temp);
				temp = [];
				char = String.fromCharCode(char.charCodeAt(0) + 1);
				i--;
			}
		}
		partitions.push(temp);
	}
	 console.log(partitions);
	
	var combined_partitions = [];
	var temp = [];
	for(let i = 0; i < partitions.length; i++){
		if(partitions[i].length <= 25)
			temp = temp.concat(partitions[i]);
		else{
			for(let j = 0; j < partitions[i].length/25; j++){
				combined_partitions.push(partitions[i].slice(25*j,25*(j+1)));
			}
		}
		if(temp.length >= 10 || (temp.length >= 5 && i != partitions.length-1 && partitions[i+1].length >= 15)){
			combined_partitions.push(temp);
			temp = [];
		}
	}
	if(temp.length != 0)
		combined_partitions.push(temp);
	if(order == 2){
		combined_partitions = partitions.slice();
		/*
		combined_partitions = [];
		for(let i = 0; i < partitions.length; i++){
			if(partitions[i].length <= 25)
				combined_partitions.push(partitions[i]);
			else{
				for(let j = 0; j < partitions[i].length/25; j++){
					combined_partitions.push(partitions[i].slice(25*j,25*(j+1)));
					if(j == partitions[i].length/25 - 1)
						combined_partitions.push(partitions[i].slice(25*(j+1),partitions[i].length));
				}
			}
		}
		*/
	}
	
	// console.log(combined_partitions);
	
	var partition_name = "";
	if(order == 0)
		partition_name = s_dict[combined_partitions[0][0][1]].split(" ")[s_dict[combined_partitions[0][0][1]].split(" ").length-1].substring(0,1) + "-" 
			+ s_dict[combined_partitions[0][combined_partitions[0].length-1][1]].split(" ")[s_dict[combined_partitions[0][combined_partitions[0].length-1][1]].split(" ").length-1].substring(0,1);
	else if(order == 1)
		partition_name = p_dict[combined_partitions[0][0][2]].split(" ")[p_dict[combined_partitions[0][0][2]].split(" ").length-1].substring(0,1) + "-" 
			+ p_dict[combined_partitions[0][combined_partitions[0].length-1][2]].split(" ")[p_dict[combined_partitions[0][combined_partitions[0].length-1][2]].split(" ").length-1].substring(0,1);
	else
		partition_name = c_dict[combined_partitions[0][0][3]].split("\t")[0].split(":")[1].substring(0,1)
			+ "00-Level";
	json += '{' +
        '"name": "' + partition_name + '",' +
        '"parent": "top level",' +
        '"fake": false,' +
        '"children": [{' +
		        '"name": "' + combined_partitions[0][0][orders[0]] + '",' +
		        '"parent": "' + partition_name + '",' +
		        '"fake": false,' +
		        '"children": [{' +
		        		'"name": "' + combined_partitions[0][0][orders[1]] + '",' +
		                '"parent": "' + combined_partitions[0][0][orders[0]] + '",' +
		                '"fake": false,' +
		                '"children": [{' +
		                        '"name": "' + combined_partitions[0][0][orders[2]] + '",' +
		                        '"parent": "' + combined_partitions[0][0][orders[1]] + '",' +
		                        '"fake": false' +
                    '}';
	for(let i = 0; i < combined_partitions.length; i++){
		for(let j = 1; j < combined_partitions[i].length; j++){
			if(combined_partitions[i][j][orders[0]] == combined_partitions[i][j-1][orders[0]] 
			&& combined_partitions[i][j][orders[1]] == combined_partitions[i][j-1][orders[1]])
				json += ',{' +
	                        '"name": "' + combined_partitions[i][j][orders[2]] + '",' +
	                        '"parent": "' + combined_partitions[i][j][orders[1]] + '",' +
	                        '"fake": false' +
	                    '}';
			else if(combined_partitions[i][j][orders[0]] == combined_partitions[i][j-1][orders[0]])
				json += ']' +
			        '},' +
			        '{' +
			            '"name": "' + combined_partitions[i][j][orders[1]] + '",' +
			            '"parent": "' + combined_partitions[i][j][orders[0]] + '",' +
			            '"fake": false,' +
			            '"children": [{' +
			                    '"name": "' + combined_partitions[i][j][orders[2]] + '",' +
			                    '"parent": "' + combined_partitions[i][j][orders[1]] + '",' +
			                    '"fake": false' +
			                '}';
			else{
				json += ']' +
		        '}' +
		        ']' +
		        '}' +
		        ',{' +
			        '"name": "' + combined_partitions[i][j][orders[0]] + '",' +
			        '"parent": "' + partition_name + '",' +
			        '"children": [{' +
			                '"name": "' + combined_partitions[i][j][orders[1]] + '",' +
			                '"parent": "' + combined_partitions[i][j][orders[0]] + '",' +
			                '"fake": false,' +
			                '"children": [{' +
			                        '"name": "' + combined_partitions[i][j][orders[2]] + '",' +
			                        '"parent": "' + combined_partitions[i][j][orders[1]] + '",' +
			                        '"fake": false' +
			                    '}';
			}
		}
		if(i == combined_partitions.length - 1)
			break;
		partition_name = "";
		if(order == 0)
			partition_name = s_dict[combined_partitions[i+1][0][1]].split(" ")[s_dict[combined_partitions[i+1][0][1]].split(" ").length-1].substring(0,1) + "-" 
				+ s_dict[combined_partitions[i+1][combined_partitions[i+1].length-1][1]].split(" ")[s_dict[combined_partitions[i+1][combined_partitions[i+1].length-1][1]].split(" ").length-1].substring(0,1);
		else if(order == 1)
			partition_name = p_dict[combined_partitions[i+1][0][2]].split(" ")[p_dict[combined_partitions[i+1][0][2]].split(" ").length-1].substring(0,1) + "-" 
				+ p_dict[combined_partitions[i+1][combined_partitions[i+1].length-1][2]].split(" ")[p_dict[combined_partitions[i+1][combined_partitions[i+1].length-1][2]].split(" ").length-1].substring(0,1);
		else
			partition_name = c_dict[combined_partitions[i+1][0][3]].split("\t")[0].split(":")[1].substring(0,1)
				+ "00-Level";
		json += ']' +
	        '}' +
	        ']' +
	        '}' +
	        ']}'
		json += ',{' +
	        '"name": "' + partition_name + '",' +
	        '"parent": "top level",' +
	        '"fake": false,' +
	        '"children": [{' +
			        '"name": "' + combined_partitions[i+1][0][orders[0]] + '",' +
			        '"parent": "' + partition_name + '",' +
			        '"fake": false,' +
			        '"children": [{' +
			        		'"name": "' + combined_partitions[i+1][0][orders[1]] + '",' +
			                '"parent": "' + combined_partitions[i+1][0][orders[0]] + '",' +
			                '"fake": false,' +
			                '"children": [{' +
			                        '"name": "' + combined_partitions[i+1][0][orders[2]] + '",' +
			                        '"parent": "' + combined_partitions[i+1][0][orders[1]] + '",' +
			                        '"fake": false' +
	                    '}';
	}
	json += ']' +
	    '}' +
	    ']' +
	'}]' +
	'}]}';
	
	return JSON.parse(json);
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
	  
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function generateNodeJSON(data){
	var json = null;
	var order = 0;
	if(data.indexOf("P") != -1)
		order = 1;
	else if(data.indexOf("C") != -1)
		order = 2;
	var orders = [((order+0)%3) + 1,((order+1)%3) + 1,((order+2)%3) + 1];
	
	var related_items = [];
	for(let i = 0; i < a_list.length; i++){
		for(let j = 0; j < a_list[i].length; j++){
			if(a_list[i][j] == data){
				related_items.push(a_list[i]);
				break;
			}
		}
	}
	
	var list = related_items.sort(function(a, b){
		if(a[orders[0]].localeCompare(b[orders[0]]) != 0)
			return a[orders[0]].localeCompare(b[orders[0]]);
		if(a[orders[1]].localeCompare(b[orders[1]]) != 0)
			return a[orders[1]].localeCompare(b[orders[1]]);
		return a[orders[2]].localeCompare(b[orders[2]]);
		});
	
	json = '{' +
        '"name": "' + data + '",' +
        '"parent": "null",' +
        '"fake": false,';
	
	json += '"children": [{' +
		        '"name": "' + list[0][orders[1]] + '",' +
		        '"parent": "' + data + '",' +
		        '"fake": false,' +
		        '"children": [{' +
		        		'"name": "' + list[0][orders[2]] + '",' +
		                '"parent": "' + list[0][orders[1]] + '",' +
		                '"fake": false' +
                    '}';
	for(let i = 1; i < list.length; i++){
		if(list[i][orders[1]] == list[i-1][orders[1]])
			json += ',{' +
                        '"name": "' + list[i][orders[2]] + '",' +
                        '"parent": "' + list[i][orders[1]] + '",' +
                        '"fake": false' +
                    '}';
		else
			json += ']' +
		        '},' +
		        '{' +
		            '"name": "' + list[i][orders[1]] + '",' +
		            '"parent": "' + list[i][orders[0]] + '",' +
		            '"fake": false,' +
		            '"children": [{' +
		                    '"name": "' + list[i][orders[2]] + '",' +
		                    '"parent": "' + list[i][orders[1]] + '",' +
		                    '"fake": false' +
		                '}';
		}
		
	json += ']' +
			'}]}';
	return JSON.parse(json);
}