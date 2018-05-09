var selected_priority_index = -1;
var priority_ids = [];

function join_tables(target_list) {
  var joined = [];
  for (let i = 0; i < target_list.length; i++) {
    joined[i] = new Array();
    for (let j = 0; j < target_list[i].length; j++) {
      if (s_dict[target_list[i][j]]) {
        joined[i].push(s_dict[target_list[i][j]]+'<br />('+target_list[i][j]+')')
      } else if (p_dict[target_list[i][j]]) {
        joined[i].push(p_dict[target_list[i][j]]+'<br />('+target_list[i][j]+')')
      } else if (c_dict[target_list[i][j]]) {
        joined[i].push(c_dict[target_list[i][j]].split("\t")[0] + '<br />' + c_dict[target_list[i][j]].split("\t")[1])
      } else {
        joined[i].push(target_list[i][j])
      }
    }
  }
  return joined
}

function update_apps_table() {
  var a_list_sorted = join_tables(a_list);
  var ret = '';
  for (let i = 0; i < a_list_sorted.length; i++) {
    ret += '<tr id="app_' + i + '">';
    for (let j = 0; j < a_list_sorted[i].length; j++) {
      ret += '<td>' + a_list_sorted[i][j] + '</td>';
    }
    ret += '</tr>';
  }
  
  return ret;
}

function addListenersToApps() {
  for (let i = 0; i < a_list.length; i++) {
    if (priority_ids.indexOf(a_list[i][0]) != -1)
      document.getElementById("app_" + i).className = "table-success";
  }
  document.getElementById("app_sort1").addEventListener("click", function () {
    a_list.sort(function (a, b) {
      return a[0].localeCompare(b[0]);
    });
    document.getElementById("apps_table_body").innerHTML = update_apps_table();
    addListenersToApps();
  });
  document.getElementById("s_sort1").addEventListener("click", function () {
    a_list.sort(function (a, b) {
      var last_name1 = s_dict[a[1]].split(" ")[s_dict[a[1]].split(" ").length-1];
      var last_name2 = s_dict[b[1]].split(" ")[s_dict[b[1]].split(" ").length-1];
      return last_name1.localeCompare(last_name2);
    });
    document.getElementById("apps_table_body").innerHTML = update_apps_table();
    addListenersToApps();
  });
  document.getElementById("p_sort1").addEventListener("click", function () {
    a_list.sort(function (a, b) {
    	var last_name1 = p_dict[a[2]].split(" ")[p_dict[a[2]].split(" ").length-1];
        var last_name2 = p_dict[b[2]].split(" ")[p_dict[b[2]].split(" ").length-1];
        return last_name1.localeCompare(last_name2);
    });
    document.getElementById("apps_table_body").innerHTML = update_apps_table();
    addListenersToApps();
  });
  document.getElementById("c_sort1").addEventListener("click", function () {
    a_list.sort(function (a, b) {
      return a[3].localeCompare(b[3]);
    });
    document.getElementById("apps_table_body").innerHTML = update_apps_table();
    addListenersToApps();
  });
}

function update_priorities_table(entry) {
  var entry_sorted = join_tables(entry);
  priority_ids = [];
  var ret = '';
  for (let i = 0; i < entry_sorted.length; i++) {
    ret += '<tr id="priority_' + i + '">';
    for (let j = 0; j < entry_sorted[i].length; j++) {
      ret += '<td>' + entry_sorted[i][j] + '</td>';
    }
    ret += '</tr>';
    priority_ids.push(entry_sorted[i][0]);
  }
  return ret;
}

function addListenersToPriorities(entry) {
  for (let i = 0; i < entry.length; i++) {
    document.getElementById("priority_" + i).addEventListener("click", function () {
      selected_priority_index = i;
      document.getElementById("priority_" + i).className = "table-secondary";
      document.getElementById("remove_priority_button").disabled = false;
      document.getElementById("remove_priority_button").style.visibility = 'visible';
      for (let j = 0; j < entry.length; j++) {
        if (j != i)
          document.getElementById("priority_" + j).removeAttribute("class");
      }
    });
  }
  document.getElementById("app_sort2").addEventListener("click", function () {
    entry.sort(function (a, b) {
      return a[0].localeCompare(b[0]);
    });
    document.getElementById("priorities_table_body").innerHTML = update_priorities_table(entry);
    addListenersToPriorities(entry);
  });
  document.getElementById("s_sort2").addEventListener("click", function () {
    entry.sort(function (a, b) {
    	var last_name1 = s_dict[a[1]].split(" ")[s_dict[a[1]].split(" ").length-1];
        var last_name2 = s_dict[b[1]].split(" ")[s_dict[b[1]].split(" ").length-1];
        return last_name1.localeCompare(last_name2);
    });
    document.getElementById("priorities_table_body").innerHTML = update_priorities_table(entry);
    addListenersToPriorities(entry);
  });
  document.getElementById("p_sort2").addEventListener("click", function () {
    entry.sort(function (a, b) {
    	var last_name1 = p_dict[a[2]].split(" ")[p_dict[a[2]].split(" ").length-1];
        var last_name2 = p_dict[b[2]].split(" ")[p_dict[b[2]].split(" ").length-1];
        return last_name1.localeCompare(last_name2);
    });
    document.getElementById("priorities_table_body").innerHTML = update_priorities_table(entry);
    addListenersToPriorities(entry);
  });
  document.getElementById("c_sort2").addEventListener("click", function () {
    entry.sort(function (a, b) {
      return a[3].localeCompare(b[3]);
    });
    document.getElementById("priorities_table_body").innerHTML = update_priorities_table(entry);
    addListenersToPriorities(entry);
  });
}

function update_matching_table() {
  var matches_sorted = join_tables(matches);
  var ret = '';
  for (let i = 0; i < matches_sorted.length; i++) {
    ret += '<tr id="match_' + i + '">';
    for (let j = 0; j < matches_sorted[i].length; j++) {
      ret += '<td>' + matches_sorted[i][j] + '</td>';
    }
    ret += '</tr>';
  }
  return ret;
}

function addListenersToMatches() {
  for (let i = 0; i < matches.length; i++) {
    if (priority_ids.indexOf(matches[i][0]) != -1)
      document.getElementById("match_" + i).className = "table-success";
  }
  document.getElementById("app_sort").addEventListener("click", function () {
    matches.sort(function (a, b) {
      return a[0].localeCompare(b[0]);
    });
    document.getElementById("matches_table_body").innerHTML = update_matching_table();
    addListenersToMatches();
  });
  document.getElementById("s_sort").addEventListener("click", function () {
    matches.sort(function (a, b) {
    	var last_name1 = s_dict[a[1]].split(" ")[s_dict[a[1]].split(" ").length-1];
        var last_name2 = s_dict[b[1]].split(" ")[s_dict[b[1]].split(" ").length-1];
        return last_name1.localeCompare(last_name2);
    });
    document.getElementById("matches_table_body").innerHTML = update_matching_table();
    addListenersToMatches();
  });
  document.getElementById("p_sort").addEventListener("click", function () {
    matches.sort(function (a, b) {
    	var last_name1 = p_dict[a[2]].split(" ")[p_dict[a[2]].split(" ").length-1];
        var last_name2 = p_dict[b[2]].split(" ")[p_dict[b[2]].split(" ").length-1];
        return last_name1.localeCompare(last_name2);
    });
    document.getElementById("matches_table_body").innerHTML = update_matching_table();
    addListenersToMatches();
  });
  document.getElementById("c_sort").addEventListener("click", function () {
    matches.sort(function (a, b) {
      return a[3].localeCompare(b[3]);
    });
    document.getElementById("matches_table_body").innerHTML = update_matching_table();
    addListenersToMatches();
  });
}