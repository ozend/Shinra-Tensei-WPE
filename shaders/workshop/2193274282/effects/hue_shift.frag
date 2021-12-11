
// [COMBO] {"material":"Cursor Shift","combo":"USECURSOR","type":"options","default":0}

#include "common.h"

uniform sampler2D g_Texture0; // {"material":"framebuffer","label":"ui_editor_properties_framebuffer","hidden":true}
uniform sampler2D g_Texture1; // {"combo":"MASK","default":"util/white","label":"ui_editor_properties_opacity_mask","material":"mask","mode":"opacitymask","paintdefaultcolor":"0 0 0 1"}

uniform vec2 g_PointerPosition;
varying vec4 v_PointerUV;

uniform float g_Time;

uniform float u_HueShiftSpeed; // {"material":"speed","label":"Hue Shift Speed","default":0.25,"range":[0,10]}

varying vec4 v_TexCoord;

#if AUDIOPROCESSING
varying float v_AudioShift;
#endif

void main() {
	vec4 albedo = texSample2D(g_Texture0, v_TexCoord.xy);
	float mask = texSample2D(g_Texture1, v_TexCoord.zw).r;
	
	vec3 newAlbedo = rgb2hsv(albedo.rgb);

#if USECURSOR ==1
 	newAlbedo.x = frac(newAlbedo.x * g_PointerPosition);
 	albedo.rgb = mix(albedo, newAlbedo, mask);
#endif

#if AUDIOPROCESSING
	newAlbedo.x = frac(newAlbedo.x + v_AudioShift);
	newAlbedo = hsv2rgb(newAlbedo);
	albedo.rgb = mix(albedo, newAlbedo, mask);

#else
	newAlbedo.x = frac(newAlbedo.x + g_Time * u_HueShiftSpeed);
	newAlbedo = hsv2rgb(newAlbedo);
	albedo.rgb = mix(albedo, newAlbedo, mask);
	
#endif

	gl_FragColor = albedo;
}