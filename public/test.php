<!-- test-upload.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Test File Upload</title>
</head>
<body>
  <form action="upload.php" method="post" enctype="multipart/form-data">
    Select image to upload:
    <input type="file" name="image" id="image">
    Select video to upload:
    <input type="file" name="video" id="video">
    <button type="submit">Upload File</button>
  </form>
</body>
</html>
