	google.setOnLoadCallback(drawChart);

	var chart1,chart2;
	var SleepSeries, StepSeries;
	var WalkGoal1,OldWalkGoal, OldStepSeries, WalkGoalStep;

	var numRows = data.getNumberOfRows();
	var numCols = data.getNumberOfColumns();	

	data.addColumn({'type': 'string', 'role': 'tooltip'});
	data.addColumn('number','NormalizedData', 'NormalizedData');
	data.addColumn('number', TDailyGoals);

	data.addColumn('number', TASleepTime);
	data.addColumn('number', TAwakeTime);

	data.addColumn('string','DateAsString', 'DateAsString'); 
	data.addColumn('string','DowAsString', 'DowAsString'); 
	
	SleepSeries = 8;
	StepSeries = 13;
	WalkGoalStep = 1000;
	var StepOptions = [13, 12, 14, 15, 16, 17, 18, 19, 20]; 
	var SleepOptions = [8, 9, 10, 11, numCols+3, numCols+4];
	var d1,d2,Hr ;

	var week = [TD0, TD1, TD2, TD3, TD4, TD5, TD6];
	var Chart4options = {
		'colors': []
	};


	for (var i = 0; i < numRows; i++)
	{
		var d1 = new Date(data.getValue(i,21));
		var d2 = new Date(data.getValue(i,22));
		if (+d1 === +d2)
		{
			Hr = null;
		}
		else if (d1.getDate() == 30) {
			Hr = d1.getHours()+d1.getMinutes()/60;
		}
		else {
			Hr = 24+ d1.getHours()+d1.getMinutes()/60;
		}
		data.setCell(i,numCols+3,Hr);

		if (+d1 === +d2)
		{
			Hr = null;
		}
		else if (d2.getDate() == 30) {
			Hr = -24 + d2.getHours()+d2.getMinutes()/60;
		}
		else {
			Hr = d2.getHours()+d2.getMinutes()/60;
		}
		
		data.setCell(i,numCols+4,Hr);
		
		for (var j = 0; j < 9; j++)
		if (data.getFormattedValue(i,StepOptions[j]) == 0) {
			data.setCell(i,StepOptions[j],null);
		}

		for (var j = 0; j < 4; j++)
		if (data.getFormattedValue(i,SleepOptions[j]) == 0) {
			data.setCell(i,SleepOptions[j],null);
		}

		if (data.getFormattedValue(i,6) == 0 || data.getFormattedValue(i,6) == 6 ) {
			Chart4options.colors.push('#FF9900');
		} else {
			Chart4options.colors.push('#3366CC');
		}

		data.setCell(i,numCols+5,data.getFormattedValue(i,0));
		data.setCell(i,numCols+6,week[data.getFormattedValue(i,6)]);
				
	}
	
	var StepDow = new google.visualization.DataView(data);
	var StepCal = new google.visualization.DataView(data);
	var ChartDow = new google.visualization.DataView(data);
	var Timeline = new google.visualization.DataView(data);
	Timeline.setColumns([numCols+5, numCols+6, 21,22]);
		
//	var Chart1options = {
//		'legend': 'none',
//		'colors': ['#3366CC','green','red'],
//		'trendlines': { 0: {type: 'polynomial', 'degree': 5, 'color': 'black'} },
//
//		'curveType': 'function',
//		'vAxis': {'viewWindow': {min: 0 }},
//		'hAxis': { format: 'd/M' },
//		'chartArea':{left:'85px',top:'20px',width:'80%',height:'75%'}
//	};

	var Chart1options1 = {
		'colors': ['#3366CC','green'],
		fill: 10,
		thickness: 2,
		legendPosition: 'newRow'
	};

	var Chart2options = {
		'legend': 'none',
		'colors': ['#DC3912','transparent'],
		'hAxis': { 'ticks': [{v:0, f: TD0 },
		          	{v:1, f: TD1 },
		      		{v:2, f: TD2 },
		      		{v:3, f: TD3 },
		      		{v:4, f: TD4 },
		      		{v:5, f: TD5 },
		      		{v:6, f: TD6 }]
		},
		'chartArea':{left:'85px',top:'10px',width:'80%',height:'75%'},
		'trendlines': { 0: {type: 'polynomial', 'degree': 5,  'color': 'black'},
			      1: {  'color': '#109618'}
		 	}
	};

		
	function getWidth() {
		if (self.innerHeight) {
			return self.innerWidth;
		}
		
		if (document.documentElement && document.documentElement.clientHeight) {
			return document.documentElement.clientWidth;
		}
		
		if (document.body) {
			return document.body.clientWidth;
		}
	}
	
	function getHeight() {
		if (self.innerHeight) {
			return self.innerHeight;
		}
	
		if (document.documentElement && document.documentElement.clientHeight) {
			return document.documentElement.clientHeight;
		}
	
		if (document.body) {
			return document.body.clientHeight;
		}
	}	
	
	var Wwidth = Math.min(Math.ceil((getWidth()*9/10-60)/53),Math.ceil((getHeight()*9/10-350)/21))

	var Chart3options = {
		height: Wwidth*21,
		'calendar': { 'cellSize': Wwidth, 'daysOfWeek': TDL }
	};
	

	function RD()
	{
		StepSeries = parseInt(document.StepForm.Select2.options[document.StepForm.Select2.selectedIndex].value);
		
		if (StepSeries != OldStepSeries && StepSeries != 0) {
			if (StepSeries == 99) {
				StepDow.setColumns([6, numCols+3,numCols+2,23]);
				ChartDow.setColumns([0, numCols+3,numCols+2,numCols+4,23]);

				document.getElementById("chart4_div").style.height = numRows*47+"px";
				document.getElementById("chart4_div").style.visibility = 'visible';

				document.getElementById("chart3_div").style.height = "1px";
				document.getElementById("chart3_div").style.visibility = 'hidden';
				StepSeries = numCols+3;
				WalkGoal1 = 0;
				
			} else {
				StepDow.setColumns([6, StepSeries,numCols+2,23]);
				ChartDow.setColumns([0, StepSeries,numCols+2,23]);
				StepCal.setColumns([0, numCols+1]);

				document.getElementById("chart4_div").style.height = "10px";
				document.getElementById("chart4_div").style.visibility = 'hidden';

			       	document.getElementById("chart3_div").style.height = Wwidth*21+"px";
				document.getElementById("chart3_div").style.visibility = 'visible';

				if (StepSeries == 13) {
					WalkGoal1 = WalkGoal;
					WalkGoalStep = 1000;
				} 
				else if (StepSeries == 8) {
					WalkGoal1 = SleepGoal*60;
					WalkGoalStep = 60;
				}
				else if (StepSeries == numCols+3) {
					WalkGoal1 = 21;
					WalkGoalStep = 1;
				}	
				else if (StepSeries == numCols+4) {
					WalkGoal1 = 8;
					WalkGoalStep = 1;
				}	
				else {
					WalkGoal1 = Math.round(data.getColumnRange(StepSeries).max*8/Math.pow(10,Math.round(Math.log(data.getColumnRange(StepSeries).max)/2.303)))
					*Math.pow(10,(Math.round(Math.log(data.getColumnRange(StepSeries).max)/2.303)-1));
					WalkGoalStep = Math.round(data.getColumnRange(StepSeries).max/Math.pow(10,Math.round(Math.log(data.getColumnRange(StepSeries).max)/2.303)))
					*Math.pow(10,(Math.round(Math.log(data.getColumnRange(StepSeries).max)/2.303)-1));
				}
			}
			OldWalkGoal = -99;
			
			OldStepSeries = StepSeries;
		}

		document.getElementById('WalkGoal').innerHTML = WalkGoal1 ;

		if (WalkGoal1 != OldWalkGoal) {
			for (var i = 0; i < numRows; i++)
			{
				if (data.getFormattedValue(i,StepSeries) == 0) {
					data.setCell(i,numCols+1,null);
				}
				else {
					data.setCell(i,numCols+1,data.getFormattedValue(i,StepSeries)-WalkGoal1)
				}
				data.setCell(i,numCols+2,WalkGoal1);
			}
			OldWalkGoal = WalkGoal1;
			
		}
		
		chart1.draw(ChartDow, Chart1options1);
		chart2.draw(StepDow, Chart2options);
		chart3.draw(StepCal, Chart3options);
		chart4.draw(Timeline, Chart4options);

	}
	window['RD'] = RD;
	             
	function drawChart() {
		chart1 = new google.visualization.AnnotationChart(document.getElementById('chart1_div'));
		chart2 = new google.visualization.ScatterChart(document.getElementById('chart2_div'));
		chart3 = new google.visualization.Calendar(document.getElementById('chart3_div'));
		chart4 = new google.visualization.Timeline(document.getElementById('chart4_div'));

	       	document.getElementById("chart3_div").style.height = Wwidth*21+"px";

		select = document.getElementById("Select2"); 

		
		for(var i = 0; i < StepOptions.length; i++) {
		    var el = document.createElement("option");
		    el.textContent = data.getColumnLabel(StepOptions[i]);
		    el.value = StepOptions[i];
		    select.appendChild(el);
		}

		var el = document.createElement("option");
		el.textContent = ' ';
		el.value = 0;
		select.appendChild(el);
		
		document.getElementById('Goals').innerHTML = TDailyGoals ;
	
		for(var i = 0; i < SleepOptions.length; i++) {
		    var el = document.createElement("option");
		    el.textContent = data.getColumnLabel(SleepOptions[i]);
		    el.value = SleepOptions[i];
		    select.appendChild(el);
		}

		var el = document.createElement("option");
		el.textContent = ' ';
		el.value = 0;
		select.appendChild(el);

		var el = document.createElement("option");
		el.textContent = 'Sleep Timeline';
		el.value = 99;
		select.appendChild(el);

		RD();

		google.visualization.events.addListener(chart3, 'select',
            	function() {
			chart1.setSelection(chart3.getSelection());
			chart2.setSelection(chart3.getSelection());
		});

		google.visualization.events.addListener(chart1, 'select',
		function() {
			chart3.setSelection(chart1.getSelection());
			chart2.setSelection(chart1.getSelection());
		});

		google.visualization.events.addListener(chart2, 'select',
		function() {
			chart3.setSelection(chart2.getSelection());
			chart1.setSelection(chart2.getSelection());
		});
		
	}
	
	function GD() {
		if (WalkGoal1 > WalkGoalStep) {
			WalkGoal1 = WalkGoal1 -WalkGoalStep;
			RD();
		}	
	}
	window['GD'] = GD;
	
	function GI() {
		if (WalkGoal1 < data.getColumnRange(StepSeries).max) {
			WalkGoal1 = WalkGoal1 +WalkGoalStep;
			RD();
		}
	}
	window['GI'] = GI;
	