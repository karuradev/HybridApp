/**
============== GPL License ==============
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.


============== Commercial License==============
https://github.com/karuradev/licenses/blob/master/toc.txt
*/

package com.karura.javascript;



import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Set;
import java.util.Stack;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonNull;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

public class JavaScriptDependencyProcessor {

	public static void printUsage(String... message) {
		System.err.println("Karura Single Page Apps Javascript dependency processor");
		System.err.println("---------------------------------------------");
		System.err.println("java -jar spadep.jar [html_file] [output_folder] [debug]");
		System.err.println("html_file : Path to html file containing karura dependency script");
		System.err.println("output_folder : Path to directory where  processed [html_file] needs to be generated");

		System.err.println("---------------------------------------------");
		if (message.length > 0) {
			System.err.println("Error : " + message[0]);
			System.err.println("---------------------------------------------");
		}
	}

	/**
	 * @param args
	 */
	
	static boolean debug = false;
	public static void main(String[] args) {

		if (args.length < 2 || args.length > 3) {
			printUsage();
			System.exit(0);
		}
		
		if (args.length == 3){
			debug = true;
		}

		if (!new File(args[0]).isFile()) {
			printUsage("Please specify a valid source html file");
			System.exit(0);
		}

		if (!new File(args[1]).isDirectory()) {
			printUsage("Please specify a valid destination directory");
			System.exit(0);
		}

		try {

			System.out.println("----------------------------");
			System.out.println("Processing :" + args[0]);
			System.out.println("Dumping results to : " + args[1]);
			System.out.println("----------------------------");

			generateHtmlWithCorrectDependencies(args[0], args[1]);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	static void generateHtmlWithCorrectDependencies(String sourceFile, String destDir) throws ParserConfigurationException, SAXException, IOException, TransformerException{
		DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
		DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
		Document doc = dBuilder.parse(sourceFile);

		doc.getDocumentElement().normalize();

		NodeList nList = doc.getElementsByTagName("script");

		for (int index = 0; index < nList.getLength(); index++) {

			Node nNode = nList.item(index);
			//System.out.println(">" + nNode.getNodeName() + " " + nNode.getNodeType());

			if (nNode.getNodeType() == Node.ELEMENT_NODE) {
				Element eElement = (Element) nNode;

				NamedNodeMap al = eElement.getAttributes();
				for (int k = 0; k < al.getLength(); k++) {
					Node attributeNode = al.item(k);

					if (attributeNode.getNodeName().equals("type")
							&& attributeNode.getNodeValue().equals("javascript/dependency")) {
						NodeList headNodes = doc.getElementsByTagName("head");
						headNodes.item(0).removeChild(eElement);
						
						NodeList depNodes = eElement.getChildNodes();

						if (eElement.getChildNodes().getLength() == 1
								&& eElement.getFirstChild().getNodeType() == Node.TEXT_NODE) {
							

							final HashMap<String, Set<String>> moduleMap = new HashMap<String, Set<String>>();
							final HashMap<String, JsonObject> moduleJsonMap = new HashMap<String, JsonObject>();

							parseModuleDependencyGraph(eElement, moduleMap, moduleJsonMap);

							ArrayList<String> sortedKeys = sortDependencies(moduleMap.keySet().toArray(), moduleMap);
							
							createDocumentNodes(doc, sortedKeys.toArray(), moduleJsonMap);
							createOutputFile(doc, destDir);
							
						} else {
							printUsage("Dependency structure was not found as expected. Please correct the structure and try again.");
							System.exit(0);
						}
					}
				}
			}
		}
	}
	
	static void parseModuleDependencyGraph(Element eElement,HashMap<String, Set<String>> moduleMap, HashMap<String, JsonObject> moduleJsonMap){
		String dependencyText = eElement.getFirstChild().getNodeValue();
		JsonArray modules = (JsonArray) new JsonParser().parse(dependencyText);
		
		for (int j = 0; j < modules.size(); j++) {
			if (modules.get(j) instanceof JsonNull) continue;
			JsonObject module = (JsonObject) modules.get(j);
			if (module != null) {

				String modName = module.get("name").getAsString();
				moduleJsonMap.put(modName, module);
				if (moduleMap.get(modName) == null) {
					moduleMap.put(modName, new HashSet<String>());
				}
				if (module.get("depends") != null) {
					JsonArray deps = module.get("depends").getAsJsonArray();
					for (int l = 0 ; l < deps.size(); l++) {
						JsonElement dep = deps.get(l);
						String depName = dep.getAsString();
						if (moduleMap.get(depName) == null) {
							moduleMap.put(depName, new HashSet<String>());
						}
						
						moduleMap.get(modName).add(depName);
					}
				}
				//System.out.println(module.toString());
			}
		}
	}
	
	static ArrayList<String> sortDependencies(Object[] keysToSort, HashMap<String, Set<String>> moduleMap){
		ArrayList<String> sortedKeys = new ArrayList<String>();
		sortedKeys.add((String)keysToSort[0]);
		
		for(int i = 1; i < keysToSort.length; i++){
			String next_key = (String)keysToSort[i];
			boolean inserted = false;
			
			for (int l = 0; l < sortedKeys.size(); l++){
				String already_sorted_key = sortedKeys.get(l);
				
				if (search(moduleMap, null, already_sorted_key, already_sorted_key, next_key)){
					sortedKeys.add(l, next_key);
					inserted = true;
					break;
					
				}
			}
			if (!inserted){
				sortedKeys.add(next_key);
			}
		}
		return sortedKeys;
	}
	
	static boolean search(HashMap<String, Set<String>> moduleMap, Stack<String> processedStack, String base_module, String current_module, String module_for_dep_check) {
		if (debug)
		System.out.println("Checking if  " + module_for_dep_check + " is dependent on " + current_module);
		
		if (processedStack == null){
			processedStack = new Stack<String>();
		}
		
		if (debug)
		System.out.println(">" + processedStack);
		
		if (processedStack.contains(module_for_dep_check)){
			return false;
		}
		
		if (processedStack.contains(current_module)){
			System.err.println("There was a circular dependency detected in " + base_module + " and " + module_for_dep_check);
			System.err.println("The dependency was detected at " + current_module);
			System.err.println(processedStack);
			System.exit(1);
		}
		
		Set<String> leftDeps = moduleMap.get(current_module);
		
		if (current_module.compareTo(module_for_dep_check) == 0){
			return false;
		}
		
		if (leftDeps.size() == 0){
			//Since I have got no dependencies so rh cannot be dependent on me, and
			//both me and rh are of same value
			return false;
		}
	
		// if right is a dependency of left, then right should come first in our list
		if (leftDeps.contains(module_for_dep_check)) {
			return true;
		}
		
		//now since right is not present in the list of left, we have to check if it present in the depencies 
		//of any of what
		for(String entry : leftDeps){
			//if rh was found as a dependency on one of the entries than lh > rh
			processedStack.push(current_module);
			boolean result = search(moduleMap, processedStack, base_module, entry, module_for_dep_check);
			processedStack.pop();
			if (result) return true;
		}
		return false;
	}
	
	static void createDocumentNodes(Document doc, Object[] sortedKeys, HashMap<String, JsonObject> moduleJsonMap){
		NodeList nList = doc.getElementsByTagName("head");
		for (Object key : sortedKeys) {
			JsonObject module = moduleJsonMap.get((String) key);
			
			if (module == null){
				System.err.println("Something is not correct in dependency declaration : " + key);
				System.exit(0);
			}
			
			if (module.get("path") == null){
				System.err.println("Module path not defined for module : " + key);
				System.exit(0);
			}
			String path = module.get("path").getAsString();
			Element scriptNode = doc.createElement("script");
			scriptNode.setAttribute("type", "text/javascript");
			scriptNode.setAttribute("src", path);
			nList.item(0).appendChild(scriptNode);
			
			//System.out.println(key + " : " + path + " : ");
		}
	}
	
	static void createOutputFile(Document doc, String destDir) throws TransformerException, FileNotFoundException, UnsupportedEncodingException{
		
		//(1)
		TransformerFactory tf = TransformerFactory.newInstance();
		tf.setAttribute("indent-number", new Integer(2));
		
		Transformer transformer = tf.newTransformer();
		transformer.setOutputProperty(OutputKeys.INDENT, "yes");
		transformer.setOutputProperty("{http://xml.apache.org/xslt}indent-amount", "2");
		
		
		OutputStream out = new FileOutputStream(new File(destDir, "index.html").getAbsolutePath());
		StreamResult result = new StreamResult(new OutputStreamWriter(out, "utf-8"));
		DOMSource source = new DOMSource(doc);
		transformer.transform(source, result);
	}
}
