import type { IconType } from "react-icons";
import { LuWorkflow } from "react-icons/lu";
import { RiOpenaiFill } from "react-icons/ri";
import {
  SiClaude,
  SiCss,
  SiDocker,
  SiGit,
  SiGooglegemini,
  SiHtml5,
  SiJavascript,
  SiLaravel,
  SiLangchain,
  SiModelcontextprotocol,
  SiMongodb,
  SiMysql,
  SiNextdotjs,
  SiNumpy,
  SiPandas,
  SiPhp,
  SiPython,
  SiReact,
  SiTailwindcss,
  SiWordpress,
} from "react-icons/si";
import { TbSql } from "react-icons/tb";

/**
 * Iconos de tecnologías disponibles para el stack.
 * Para añadir uno nuevo: importa el icono y añádelo aquí;
 * después ya puedes usar su clave en `profile.ts`.
 */
export const techIcons = {
  python: SiPython,
  langchain: SiLangchain,
  openai: RiOpenaiFill,
  claude: SiClaude,
  gemini: SiGooglegemini,
  mcp: SiModelcontextprotocol,
  n8n: LuWorkflow,
  sql: TbSql,
  pandas: SiPandas,
  numpy: SiNumpy,
  mongodb: SiMongodb,
  docker: SiDocker,
  html: SiHtml5,
  css: SiCss,
  javascript: SiJavascript,
  react: SiReact,
  nextjs: SiNextdotjs,
  php: SiPhp,
  laravel: SiLaravel,
  tailwind: SiTailwindcss,
  mysql: SiMysql,
  wordpress: SiWordpress,
  git: SiGit,
} satisfies Record<string, IconType>;

export type TechIconKey = keyof typeof techIcons;
