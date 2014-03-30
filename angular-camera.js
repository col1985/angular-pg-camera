/**
 * @author: Colúm Bennett <colum.bennett@feedhenry.com>,
 * @description: angularJS service module wrapping Phonegaps Native Camera API, further info see README.md.
 */

'use strict'

angular.module('fhcamera', []).service("fhcamera", ['',
    function($timeout) {

        /**
         * @param: {popOver}: popOver params
         * @param: {picSrc}: picture / image source
         * @param: {destType}: destinationType, sets format of returned value
         */
        var popOver;
        var pictureSource;
        var destinationType;

        /**
         * check if we are online and have a connection
         */
        try {
            document.addEventListener("deviceready", onDeviceReady, false);
        } catch (e) {
            outputHandler("error", e.message, e.stack);
        }

        /**
         * console output handler
         */

        function outputHandler(type, msg, obj) {
            switch (type) {
                case "info":
                    console.info("INFO: " + msg);
                    break;
                case "debug":
                    console.debug("DEBUG: Something is wrong!: ", msg);
                    console.debug("DEBUG ERR STACK: \n", obj);
                    break;
                case "warn":
                    console.warn("WARNING: Something is wrong!: " + msg);
                case "error":
                    console.error("ERR: Something is wrong!: " + msg);
                    console.error("ERR STACK: \n", obj);
                    break;
                default:
                    console.log("LOG: " + msg)
            }
        };

        /**
         * called when deviceready
         */

        function onDeviceReady() {
            pictureSource = navigator.camera.PictureSourceType;
            destinationType = navigator.camera.DestinationType;
        };

        /**
         * set popOver properties, create new instance
         */

        function setPopoverOptions(x, y, width, height, selectedArrowPos) {
            var arrowPosObj = {
                "ANY": Camera.PopoverArrowDirection.ARROW_ANY,
                "UP": Camera.PopoverArrowDirection.ARROW_UP,
                "DOWN": Camera.PopoverArrowDirection.ARROW_DOWN,
                "LEFT": Camera.PopoverArrowDirection.ARROW_LEFT,
                "RIGHT": Camera.PopoverArrowDirection.ARROW_RIGHT,
            };

            var option = arrowPosObj[selectedArrowPos];
            return new CameraPopoverOptions(x, y, width, option);
        }

        /**
         * Return base64 image
         */

        function onDataPhotoSuccess(imageData) {
            $timeout(function() {
                // do your thing here!
                alert("Success! " + "\ndata:image/png;base64" + imageData);
            }, 0);
            // return {
            //     src: "data:image/png;base64" + imageData
            // };
        };

        /**
         * Return image file path
         */

        function onURIPhotoSuccess(imageURI) {
            // timeout iOS quirk
            $timeout(function() {
                addFileEntry(imageURI)
            }, 0);
            // return {
            //     src: imageURI
            // };
        }

        // TODO: Found next 3 example on Stack OverFlow.
        /**
         * add file entry to local fileSystem
         */

        function addFileEntry(imageURI) {
            window.resolveLocalFileSystemURI(imageURI, copyPhoto, fail);
        }

        /**
         * Called when a photo is successfully retrieved
         */

        function copyPhoto(fileEntry) {
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSys) {
                fileSys.root.getDirectory("photos", {
                    create: true,
                    exclusive: false
                }, function(dir) {
                    fileEntry.copyTo(dir, "file.jpg", onCopySuccess, fail);
                }, fail);
            }, fail);
        }

        /**
         * Print file path to console on success
         */

        function onCopySuccess(entry) {
            $timeout(function() {
                outputHandler("debug", entry.fullPath, entry);
            }, 0);
        }

        /**
         * Called when a photo is successfully retrieved
         */

        function fail(error) {
            outputHandler("error", error.code, error);
        }

        /**
         * Take pic using device camera and return img src / path
         */

        this.capturePhoto = function(userOptions) {
            var imgOptions;

            // default options
            var options = {
                quality: 75,
                allowEdit: true,
                targetWidth: 300,
                targetHeight: 300,
                encodingType: Camera.EncodingType.PNG,
                // popoverOptions: setPopoverOptions(0, 32, 300, 300, "ANY"),
                sourceType: pictureSource.CAMERA,
                destinationType: destinationType.FILE_URI
            };

            if (userOptions) {
                imgOptions = userOptions;
            } else if (!userOptions) {
                imgOptions = options;
            }

            try {
                navigator.camera.getPicture(onURIPhotoSuccess, fail, imgOptions);
            } catch (e) {
                outputHandler("error", e.message, e);
            }
        }

        /**
         * Retrieve image file location from specified source
         */
        this.getImage = function() {
            navigator.camera.getPicture(onURIPhotoSuccess, outputHandler, {
                destinationType: destinationType.FILE_URI,
                sourceType: pictureSource.SAVEDPHOTOALBUM,
            });
        }

        return {
            takePhoto: this.capturePhoto,
            getPhoto: this.getImage
        };
    }
]);
