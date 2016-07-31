# aws-s3-lambda-thumbnail-generator
An Amazon Web Services Lambda function that generates thumbnails from images uploaded to AWS S3.

## Usage
If you have a platform (website, mobile app, etc...) with a user-generated content where users upload images to Amazon's S3 and you need to automatically generate thumbnails, then this is a great solution that can be integrated in few minutes.

##### What is Lambda?
Lambda is an Amazon Web Service that triggers a **function** in response to a specific **event**. 

Example:
* **Event**: Uploading an image to S3 (a.k.a S3 PUT)
* **Function**: Generate thumbnail for the uploaded image and place it in a thumbnail folder

## Installation
NOTE: This guide assumes that you're already familiar with AWS & S3.

1. Log in to your AWS account
2. Click on **Lambda** from the list of the available services
![alt text](https://s3.amazonaws.com/sailybucket/open-source/aws-s3-lambda-thumbnail-generator/images/lambda.png "Lambda logo")
3. Click on **Get Started**
4. From the left menu choose **Configure triggers**

  * Choose **S3** from the list of available events/services 
  * Make sure you choose the appropriate **Bucket** name
  * Choose **Put** for event type
  * (optional) Type in a prefix path for images to trigger events for
  * (optional) Choose what type of files to handle (png, jpg, etc..)
  * Enable trigger and click **Next**
![alt text](https://s3.amazonaws.com/sailybucket/open-source/aws-s3-lambda-thumbnail-generator/images/configure-triggers.png "Configure triggers")

5. Configuring function 

  * Give your function any name you want, add an optional description, and choose **Node.js 4.3** as your runtime
![alt text](https://s3.amazonaws.com/sailybucket/open-source/aws-s3-lambda-thumbnail-generator/images/configure-function.png "Configure function")
 
  * Upload **Thumbnailer.zip** as is
![alt text](https://s3.amazonaws.com/sailybucket/open-source/aws-s3-lambda-thumbnail-generator/images/function-code.png "Configure function") 

  * Create a new **role**, give it a name, and attach to it **S3 object read-only permission** policy
![alt text](https://s3.amazonaws.com/sailybucket/open-source/aws-s3-lambda-thumbnail-generator/images/handler.png "Configure function") 

  * Hit **Next** then **Create function**, and you're good to go!

Once you upload an image to your S3 bucket, an event will be triggered and your image will have a thumbnail autoamtically generated for it in a thumbnail folder.

## Customization
All customizations are done to **index.js**

NOTE: After modifying this file, you **MUST** compress it with **node_modules** folder and upload it again to Lambda.

##### Thumbnail size
Modify *THUMB_WIDTH = 300* & *THUMB_HEIGHT = 300* with your desired dimensions.

##### Allowed file types
Modify *ALLOWED_FILETYPES*

NOTE: Current supported files formats are: 'png', 'jpg', 'jpeg', 'bmp', 'tiff', 'pdf', 'gif'.

##### Output image format
Modify the following:

  * *ContentType: "image/**jpg**"*
  * *dstKey = THUMB_KEY_PREFIX + srcKey.replace(/\.\w+$/, ".**jpg**"),*
  * *.toBuffer("**jpg**", function(err, buffer) {*

NOTE: Currently the thumbnails is in JPG format.
## Contributions
Thanks for the amazing engineering team at [Saily](https://www.saily.co) for their continuous contributions @daniArnaout @musbaalbaki @malekhijazi

Pull requests are warmly welcomed!

## License

The MIT License (MIT)

Copyright (c) 2016 Saily

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
