#include "ofApp.h"
#include "ofxJSON.h"

//--------------------------------------------------------------
void ofApp::setup(){
    
    ofRegisterURLNotification(this);
    string url = "https://api.nasa.gov/planetary/apod?api_key=n0OdkEMGNnqqBQ7RHSGTx7U4OnwrMCAporxkvCEu";
    ofLoadURLAsync(url, "nasa");
//
//
//    ofHttpResponse resp = ofLoadURL(url);
//    cout << resp.data << endl;
    
    shader.load("cgaShader");
    color1 = ofColor::black;
    color2 = ofColor::red;
    color3 = ofColor::white;
    
    width = 640;
    height = 384;
    fbo.allocate(width, height);
    
    gui.setup(); // most of the time you don't need a name
    gui.add(dithering.setup("fill", true));
    gui.add(gamma.setup("gamma", 1.0, 0.0, 5.0));
}

//--------------------------------------------------------------
void ofApp::update(){
    
    fbo.begin();
    ofClear(0);
    shader.begin();
    
    shader.setUniform1i("dithering", dithering);
    shader.setUniform1f("gamma", gamma);
    shader.setUniform4f("col1", color1.r/255.0,  color1.g/255.0,  color1.b/255.0, color1.a/255.0);
    shader.setUniform4f("col2", color2.r/255.0,  color2.g/255.0,  color2.b/255.0, color1.a/255.0);
    shader.setUniform4f("col3", color3.r/255.0,  color3.g/255.0,  color3.b/255.0, color1.a/255.0);
    
    
    if(image.isAllocated()){
        image.draw(0, 0, width, height);
    }
    
    //m_image.draw(0, 0, m_fbo.getWidth(), m_fbo.getHeight());
    
    shader.end();
    fbo.end();
}

//--------------------------------------------------------------
void ofApp::draw(){
    
    if(image.isAllocated()){
        image.draw(0, 0, ofGetWidth(), ofGetHeight());
    }
    
    if(fbo.isAllocated()){
        fbo.draw(0, 0);
    }
    
    gui.draw();
    
  
    
   
    
}


void ofApp::urlResponse(ofHttpResponse & response)
{

    if(response.status==200)
    {
        if(response.request.name == "nasa")
        {
            ofLogNotice() <<"ofApp::urlResponse -> NASA ";
            this->parseNasa(response.data);
        }

        else if(response.request.name == "nasa_image")
        {
            ofLogNotice() <<"ofApp::urlResponse -> NASA IMAGE ";
            image.clear();
            image.load(response.data);
        }
    
    }
    else{
        cout << response.status << " " << response.error << " for request " << response.request.name << endl;
    }
}

void ofApp::parseNasa(string response)
{
    //std::cout<< file << std::endl;
    
    //ofLogNotice() <<"ApiManager::parseNasa << file: \n" << file;
    
    ofxJSONElement json(response);
    
    string url = json["url"].asString();
    
    ofFile file(url);
    string ext = file.getExtension();
    ofLogNotice() <<"ofApp::parseNasa << url = " << json["url"] << ", extension -> " <<  ext;
    
    if(ext == "jpg" || ext == "png" ){
        ofLoadURLAsync(url,"nasa_image");
    }
}


//--------------------------------------------------------------
void ofApp::keyPressed(int key){
    
    if(key == 32){
        ofLogNotice() <<"ApiManager::nasa <<keyPressed";
        string url = "https://api.nasa.gov/planetary/apod?api_key=n0OdkEMGNnqqBQ7RHSGTx7U4OnwrMCAporxkvCEu";
        ofLoadURLAsync(url, "nasa");
    }
    else if(key == 115)
    {
        ofPixels pixels;
        fbo.readToPixels(pixels);
        //pixels.crop(0,0, 200,200);
        
        ofImage image;
        image.setFromPixels(pixels);
        
        string fileName = "apod.bmp";
        image.save(fileName);
    }

}

//--------------------------------------------------------------
void ofApp::keyReleased(int key){

}

//--------------------------------------------------------------
void ofApp::mouseMoved(int x, int y ){

}

//--------------------------------------------------------------
void ofApp::mouseDragged(int x, int y, int button){

}

//--------------------------------------------------------------
void ofApp::mousePressed(int x, int y, int button){

}

//--------------------------------------------------------------
void ofApp::mouseReleased(int x, int y, int button){

}

//--------------------------------------------------------------
void ofApp::mouseEntered(int x, int y){

}

//--------------------------------------------------------------
void ofApp::mouseExited(int x, int y){

}

//--------------------------------------------------------------
void ofApp::windowResized(int w, int h){

}

//--------------------------------------------------------------
void ofApp::gotMessage(ofMessage msg){

}

//--------------------------------------------------------------
void ofApp::dragEvent(ofDragInfo dragInfo){ 

}
