package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"strings"
)

// state
// 0 for nothing
// 1 for ol
var state = 0
var h1Counter = 0

func main() {
	// open md file
	mdFilePath := "test/a.md"
	mdFile, err := os.Open(mdFilePath)
	if err != nil {
		log.Fatalf("Error when opening md file: %s", err)
		os.Exit(-1)
	}
	defer mdFile.Close()
	// open html file
	htmlFilePath := "test/note.html"
	htmlFile, err := os.OpenFile(htmlFilePath, os.O_WRONLY | os.O_CREATE, 0666)
	if err != nil {
		log.Fatalf("Error when opening html file: %s", err)
	}
	defer htmlFile.Close()
	writer := bufio.NewWriter(htmlFile)

	// 写入html文件头
	writer.WriteString("<!DOCTYPE html>\n")
	writer.WriteString("<html>\n")
	writer.WriteString("\n")
	writer.WriteString("<head>\n")
	writer.WriteString("\t<meta charset=\"utf-8\" />\n")
	writer.WriteString("\t<title>" + mdFilePath + "</title>\n")
	writer.WriteString("\t<!-- <link rel=\"stylesheet\" href=\"css/style.css\"> -->\n")
	writer.WriteString("\t<!-- <script src=\"js/a.js\"></script> -->\n")
	writer.WriteString("</head>\n")
	writer.WriteString("\n")
	writer.WriteString( "<body>\n")
	writer.WriteString("\t<div class=\"meta\">\n")

	// 逐行读取md文件内容, 转化格式, 写入html文件
	scanner := bufio.NewScanner(mdFile)
	for scanner.Scan() {
		//fmt.Println(scanner.Text())
		htmlStr := transform(scanner.Text())
		//fmt.Print(htmlStr)
		writer.WriteString(htmlStr)
	}
	if err := scanner.Err(); err != nil {
		log.Println(err)
	}
	if state == 1 {
		writer.WriteString("\t\t</ul>\n")
		state = 0
	}
	writer.WriteString("\t</div>\n")
	writer.WriteString("</body>\n")
	writer.Flush()

}

// transform mdStr to htmlStr
func transform(mdStr string) (htmlStr string){
	if len(mdStr) == 0 {
		return
	}
	index := 0
	if mdStr[index] == '#' {
		if state == 1 {
			htmlStr += "\t\t</ul>\n"
			state = 0
		}
		index++
		if mdStr[index] == '#' {
			// ## -> h2
			index += 2 // a # and a space
			htmlStr += "\t\t<h2>" + string([]rune(mdStr)[index:]) + "</h2>\n"
		} else {
			h1Counter++
			if h1Counter == 2 {
				htmlStr += "\t</div>\n"
				htmlStr += "\t<div class=\"text\">\n"
			}
			// # -> h1
			index++ // for a space
			htmlStr += "\t\t<h1>" + string([]rune(mdStr)[index:]) + "</h1>\n"
		}
	} else if mdStr[index] == '-' {
		// - -> <li>
		index++ // for a space
		if state == 0 {
			htmlStr += "\t\t<ul>\n"
			state = 1
		}
		htmlStr += "\t\t\t<li>" + string([]rune(mdStr)[index:]) + "</li>\n"
	} else if mdStr[index] == '!' {
		// ![img_name](url)
		index = strings.Index(mdStr, "(")
		index++
		if state == 1 {
			htmlStr += "\t\t</ul>\n"
			state = 0
		}
		htmlStr += "<img src=\"" + string([]rune(mdStr)[index:len(mdStr)-1]) + "\" />\n"
	} else if strings.HasPrefix(mdStr, "    - ") {
		fmt.Println("abc")
	}
	return
}