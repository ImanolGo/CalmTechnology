#version 120

uniform sampler2DRect tex0;
uniform vec4 col1;
uniform vec4 col2;
uniform vec4 col3;
uniform float gamma = 1.5; //the gamma change the threshold of the palette swapper
varying vec2 texCoordVarying;
uniform float scale = 1.0;
uniform int dithering = 0;

int matrixSize = 8;


float czm_luminance(vec3 rgb)
{
    // Algorithm from Chapter 10 of Graphics Shaders.
    const vec3 W = vec3(0.2125, 0.7154, 0.0721);
    return dot(rgb, W);
}

float find_closest(int x, int y, float brightness)
{   
    int index = x + y * matrixSize;
    float limit = 0.0;


    // int dither[8][8] = 
    // {
    //     { 0, 32, 8, 40, 2, 34, 10, 42}, 
    //     {48, 16, 56, 24, 50, 18, 58, 26},
    //     {12, 44, 4, 36, 14, 46, 6, 38}, 
    //     {60, 28, 52, 20, 62, 30, 54, 22}, 
    //     { 3, 35, 11, 43, 1, 33, 9, 41}, 
    //     {51, 19, 59, 27, 49, 17, 57, 25},
    //     {15, 47, 7, 39, 13, 45, 5, 37},
    //     {63, 31, 55, 23, 61, 29, 53, 21} 
    // }; 

    // float limit = 0.0;
    // if(x < 8)
    // {
    //     limit = (dither[x][y]+1)/64.0;
    // }

    if (x < matrixSize) {
    if (index == 0) limit = 0.015625;
    if (index == 1) limit = 0.515625;
    if (index == 2) limit = 0.140625;
    if (index == 3) limit = 0.640625;
    if (index == 4) limit = 0.046875;
    if (index == 5) limit = 0.546875;
    if (index == 6) limit = 0.171875;
    if (index == 7) limit = 0.671875;
    if (index == 8) limit = 0.765625;
    if (index == 9) limit = 0.265625;
    if (index == 10) limit = 0.890625;
    if (index == 11) limit = 0.390625;
    if (index == 12) limit = 0.796875;
    if (index == 13) limit = 0.296875;
    if (index == 14) limit = 0.921875;
    if (index == 15) limit = 0.421875;
    if (index == 16) limit = 0.203125;
    if (index == 17) limit = 0.703125;
    if (index == 18) limit = 0.078125;
    if (index == 19) limit = 0.578125;
    if (index == 20) limit = 0.234375;
    if (index == 21) limit = 0.734375;
    if (index == 22) limit = 0.109375;
    if (index == 23) limit = 0.609375;
    if (index == 24) limit = 0.953125;
    if (index == 25) limit = 0.453125;
    if (index == 26) limit = 0.828125;
    if (index == 27) limit = 0.328125;
    if (index == 28) limit = 0.984375;
    if (index == 29) limit = 0.484375;
    if (index == 30) limit = 0.859375;
    if (index == 31) limit = 0.359375;
    if (index == 32) limit = 0.0625;
    if (index == 33) limit = 0.5625;
    if (index == 34) limit = 0.1875;
    if (index == 35) limit = 0.6875;
    if (index == 36) limit = 0.03125;
    if (index == 37) limit = 0.53125;
    if (index == 38) limit = 0.15625;
    if (index == 39) limit = 0.65625;
    if (index == 40) limit = 0.8125;
    if (index == 41) limit = 0.3125;
    if (index == 42) limit = 0.9375;
    if (index == 43) limit = 0.4375;
    if (index == 44) limit = 0.78125;
    if (index == 45) limit = 0.28125;
    if (index == 46) limit = 0.90625;
    if (index == 47) limit = 0.40625;
    if (index == 48) limit = 0.25;
    if (index == 49) limit = 0.75;
    if (index == 50) limit = 0.125;
    if (index == 51) limit = 0.625;
    if (index == 52) limit = 0.21875;
    if (index == 53) limit = 0.71875;
    if (index == 54) limit = 0.09375;
    if (index == 55) limit = 0.59375;
    if (index == 56) limit = 1.0;
    if (index == 57) limit = 0.5;
    if (index == 58) limit = 0.875;
    if (index == 59) limit = 0.375;
    if (index == 60) limit = 0.96875;
    if (index == 61) limit = 0.46875;
    if (index == 62) limit = 0.84375;
    if (index == 63) limit = 0.34375;
  }


    if(brightness < limit)
        return 0.0;
    
    return 1.0;
}



void main()
{
	//vec2 uv = gl_FragCoord.xy / iResolution.xy;

    vec4 texel0 = texture2DRect(tex0, texCoordVarying);

    texel0.r = pow(abs(texel0.r),gamma);
    texel0.g = pow(abs(texel0.g),gamma);
    texel0.b = pow(abs(texel0.b),gamma);


    vec4 c = vec4(0.0);

    if(dithering > 0){

        vec2 xy = gl_FragCoord.xy * scale;
        int x = int(mod(xy.x, matrixSize));
        int y = int(mod(xy.y, matrixSize));
        vec3 ditherRGB;
        ditherRGB.r = find_closest(x, y, texel0.r);
        ditherRGB.g = find_closest(x, y, texel0.g);
        ditherRGB.b = find_closest(x, y, texel0.b);
        c = vec4(ditherRGB, 1.0);

    }
    else
    {
         c = vec4(texel0.rgb, 1.0);
    }
   
	
	float dist1 = length(c - col1);
    float dist2 = length(c - col2);
    float dist3 = length(c - col3);


    float d = min(dist1,dist2);
    d = min(d,dist3);
    
	if(d == dist1) {
        c = col1;
    }
    else if(d == dist2) {
        c = col2;
    }
    else {
        c = col3;
    }

    // float lum = czm_luminance(c.rgb);
    // if(lum < 0.33){
    //     c = col1;
    // }
    // else if(lum < 0.66){
    //     c = col2;
    // }
    // else{
    //     c = col3;
    // }

   
    gl_FragColor = c;
    //gl_FragColor = vec4(c,1.0);
}