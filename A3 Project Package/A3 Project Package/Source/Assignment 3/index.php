<?php
	//require_once "includes/db.php";
?>

<!DOCTYPE html>
<html>
	<head>
		<title>Slime Arena</title>
	</head>
	<body>
		<script src="pixi/pixi.min.js"></script>
		<script src="pixi/pixi-sound.js"></script>
		<script src="Main.js"></script> <!--Access the main script that houses the code for the game-->
		<!--<p>Test<p/>-->
		<?php //echo "<p>Test 2<p/>";

		/*Scrapped DB related code
		$querySQL = "SELECT BookName, AuthorName, BookSummary, QuantityAvailable FROM `simplebooks-inventory` WHERE AuthorName = 'Linda Myers'" ;
		$result = $dbconnection->query($querySQL) ;
		while ($row = $result->fetch_assoc()) { //Output results
			echo "<h4 class=\"fw-light\">$row[BookName]</h4>
			<h5 class=\"fw-light\">$row[AuthorName]</h5>
			<p class=\"text-muted\">$row[BookSummary]</p>
			<ul class=\"text-muted list-unstyled\">
			<li>Number of copies currently at SimpleBooks: <strong>$row[QuantityAvailable]</strong></li>
			</ul>
			<button type=\"button\" class=\"btn btn-primary\">More details &raquo;</button>" ;
		}

		$querySQL = "SELECT Name, Score FROM `high_scores` WHERE Name = 'Corey'" ;
		$result = $dbconnection->query($querySQL) ;
		while ($row = $result->fetch_assoc()) { //Output results
			echo "<h4 class=\"fw-light\">High Scores</h4>
			<p>$row[Name] - $row[Score]</p>" ;
		}*/

		?>

	</body>
</html>