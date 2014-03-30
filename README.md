###Angular Service Module wrapping PhoneGap Camera Native API v3.0.

So I have decided to re-think my approach to creating this wrapped Camera API.

My aim to write a fully functional Camera component using Angular's module Schema.

==================================================================================================================

+ Currently adding support for in browser development using getUserMedia API
+ use of $q and promises to handle component loading
+ using $document to bind deviceready event to $digest cycle
+ creaing component controller and directive to implement component 
